import { expect, test } from '@playwright/test';

import { axeViolations, openStory } from './helpers';

test('smoke story renders with token styles and has no axe violations', async ({ page }) => {
  await openStory(page, 'internal-smoke--default');
  const heading = page.getByRole('heading', { name: 'Tooling smoke test' });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS('font-weight', '700');
  expect(await axeViolations(page)).toEqual([]);
});

test('toolbar theme and mode reach the ThemeProvider wrapper', async ({ page }) => {
  await openStory(page, 'internal-smoke--default', { theme: 'soft', mode: 'dark' });
  const wrapper = page.locator('#storybook-root [data-aui-theme]').first();
  await expect(wrapper).toHaveAttribute('data-aui-theme', 'soft');
  await expect(wrapper).toHaveAttribute('data-mode', 'dark');
  // soft dark surface = stone-950
  await expect(wrapper).toHaveCSS('background-color', 'rgb(12, 10, 9)');
});

for (const theme of ['flowbite', 'slate-pro', 'soft']) {
  for (const mode of ['light', 'dark']) {
    test(`tokens page renders in ${theme} ${mode} without axe violations`, async ({ page }) => {
      await openStory(page, 'foundations-theme-tokens--tokens', { theme, mode });
      await expect(page.getByRole('heading', { name: 'Theme tokens' })).toBeVisible();
      await expect(page.getByText(`Theme ${theme}, ${mode} mode`, { exact: false })).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);
    });
  }
}

test('the three themes produce clearly different computed styles', async ({ page }) => {
  await openStory(page, 'foundations-theme-tokens--compare');
  const styles = await page.evaluate(() =>
    ['flowbite', 'slate-pro', 'soft'].map((name) => {
      const scope = document.querySelector(`[data-aui-theme="${name}"][data-mode="light"]`);
      const button = scope?.querySelector('button');
      if (!button) throw new Error(`no button for ${name}`);
      const s = getComputedStyle(button);
      return {
        background: s.backgroundColor,
        radius: s.borderTopLeftRadius,
        height: s.height,
        font: s.fontFamily.split(',')[0],
      };
    }),
  );
  for (const key of ['background', 'radius', 'height', 'font'] as const) {
    expect(new Set(styles.map((s) => s[key])).size, key).toBe(3);
  }
  expect(styles[0]?.font).toContain('Inter');
  expect(styles[1]?.font).toContain('IBM Plex Sans');
  expect(styles[2]?.font).toContain('Manrope');
  expect(await axeViolations(page)).toEqual([]);
});

test('a light provider nested inside a dark one renders light surfaces', async ({ page }) => {
  await openStory(page, 'foundations-theme-tokens--compare', { mode: 'dark' });
  const surface = (mode: string) =>
    page
      .locator(`[data-aui-theme="flowbite"][data-mode="${mode}"] > article`)
      .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(await surface('light')).toBe('rgb(255, 255, 255)');
  expect(await surface('dark')).toBe('rgb(31, 41, 55)');
});

test('fonts render Cyrillic with the theme font', async ({ page }) => {
  await openStory(page, 'foundations-theme-tokens--compare');
  const loaded = await page.evaluate(() =>
    ['Inter Variable', 'IBM Plex Sans Variable', 'Manrope Variable'].map((f) =>
      document.fonts.check(`16px "${f}"`, 'Профил'),
    ),
  );
  expect(loaded).toEqual([true, true, true]);
});

test('overrides story applies all three levels', async ({ page }) => {
  await openStory(page, 'foundations-overrides--three-levels');
  const themeLevel = page.getByText('1 · Theme level').locator('..');
  await expect(themeLevel).toHaveCSS('border-top-left-radius', '0px');
  await expect(page.getByText('1 · Theme level')).toHaveCSS('text-transform', 'uppercase');
  const instance = page.getByText('2 · Instance level').locator('..');
  await expect(instance).toHaveClass(/rotate-1/);
  const tokenLevel = page.getByText('3 · Token level').locator('..');
  await expect(tokenLevel).toHaveCSS('border-top-left-radius', '0px');
  expect(await axeViolations(page)).toEqual([]);
});
