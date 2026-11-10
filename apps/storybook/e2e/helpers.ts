import { readFileSync } from 'node:fs';

import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

/** Open a story in isolation (iframe), with optional toolbar globals. */
export async function openStory(page: Page, id: string, globals?: Record<string, string>) {
  const g = globals
    ? `&globals=${Object.entries(globals)
        .map(([k, v]) => `${k}:${v}`)
        .join(';')}`
    : '';
  await page.goto(`/iframe.html?id=${id}&viewMode=story${g}`);
  await page.locator('#storybook-root').waitFor();
  await page.evaluate(() => document.fonts.ready);
}

export async function axeViolations(page: Page) {
  // Storybook's a11y addon runs axe in the same frame; wait for it instead of colliding.
  let results: Awaited<ReturnType<AxeBuilder['analyze']>> | undefined;
  for (let attempt = 0; !results; attempt++) {
    try {
      results = await new AxeBuilder({ page }).include('#storybook-root').analyze();
    } catch (error) {
      if (attempt >= 20 || !String(error).includes('Axe is already running')) throw error;
      await page.waitForTimeout(250);
    }
  }
  return results.violations.map(
    (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  );
}

interface IndexEntry {
  id: string;
  title: string;
  name: string;
  type: 'story' | 'docs';
}

/** Stories from the static build's index, filtered by title prefix. */
export function storiesUnder(titlePrefix: string): IndexEntry[] {
  const index = JSON.parse(
    readFileSync(new URL('../storybook-static/index.json', import.meta.url), 'utf8'),
  ) as { entries: Record<string, IndexEntry> };
  return Object.values(index.entries).filter(
    (entry) => entry.type === 'story' && entry.title.startsWith(titlePrefix),
  );
}
