import { expect, test } from '@playwright/test';

import { axeViolations, openStory, storiesUnder } from './helpers';

const COMPONENTS = ['Inputs/Button', 'Inputs/Input', 'Inputs/TextInput'];

for (const title of COMPONENTS) {
  const stories = storiesUnder(title).filter((story) => story.title === title);

  test(`${title} has stories`, () => {
    expect(stories.length).toBeGreaterThan(5);
  });

  for (const story of stories) {
    test(`${title} › ${story.name} has no axe violations`, async ({ page }) => {
      await openStory(page, story.id);
      expect(await axeViolations(page)).toEqual([]);
    });
  }
}

test('Button shows a focus ring on keyboard focus only', async ({ page }) => {
  await openStory(page, 'inputs-button--variants');
  const first = page.getByRole('button', { name: 'solid' });

  await first.click();
  await expect(first).toHaveCSS('box-shadow', 'none');

  await page.keyboard.press('Tab');
  const second = page.getByRole('button', { name: 'outline' });
  await expect(second).toBeFocused();
  const shadow = await second.evaluate((element) => getComputedStyle(element).boxShadow);
  expect(shadow).not.toBe('none');
});

test('a loading Button keeps keyboard focus', async ({ page }) => {
  await openStory(page, 'inputs-button--loading');
  await page.keyboard.press('Tab');
  const loading = page.getByRole('button', { name: 'Save' }).first();
  await expect(loading).toBeFocused();
  await expect(loading).toHaveAttribute('aria-busy', 'true');
});

test('the Input clear button works from the keyboard', async ({ page }) => {
  await openStory(page, 'inputs-input--clearable');
  const input = page.getByRole('textbox', { name: 'Uncontrolled' });
  await input.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Clear' }).first()).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
});

test('TextInput announces the error after typing', async ({ page }) => {
  await openStory(page, 'inputs-textinput--controlled');
  const input = page.getByRole('textbox', { name: 'Project name' });
  await input.fill('ab');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[aria-live="polite"]')).toHaveText('At least 3 characters.');
  await input.fill('abc');
  await expect(input).not.toHaveAttribute('aria-invalid');
});

test('soft theme renders pill buttons, the others use the control radius', async ({ page }) => {
  await openStory(page, 'inputs-button--themes');
  const radius = (theme: string) =>
    page
      .getByTestId(`matrix-${theme}-light`)
      .locator('xpath=..')
      .getByRole('button', { name: 'solid' })
      .evaluate((element) => parseFloat(getComputedStyle(element).borderTopLeftRadius));
  expect(await radius('soft')).toBeGreaterThan(100);
  expect(await radius('flowbite')).toBe(8);
  expect(await radius('slate-pro')).toBeLessThan(8);
});
