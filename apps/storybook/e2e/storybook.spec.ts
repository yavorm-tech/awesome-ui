import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

/** Open a story in isolation (iframe), with optional toolbar globals. */
async function openStory(page: Page, id: string, globals?: Record<string, string>) {
  const g = globals
    ? `&globals=${Object.entries(globals)
        .map(([k, v]) => `${k}:${v}`)
        .join(';')}`
    : '';
  await page.goto(`/iframe.html?id=${id}&viewMode=story${g}`);
  await page.locator('#storybook-root').waitFor();
}

test('smoke story renders with Tailwind styles and has no axe violations', async ({ page }) => {
  await openStory(page, 'internal-smoke--default');

  const heading = page.getByRole('heading', { name: 'Tooling smoke test' });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS('font-weight', '700');

  const results = await new AxeBuilder({ page }).include('#storybook-root').analyze();
  expect(results.violations).toEqual([]);
});

test('theme and mode globals reach the theme wrapper', async ({ page }) => {
  await openStory(page, 'internal-smoke--default', { theme: 'soft', mode: 'dark' });

  const root = page.getByTestId('theme-root');
  await expect(root).toHaveAttribute('data-theme', 'soft');
  await expect(root).toHaveAttribute('data-mode', 'dark');
});
