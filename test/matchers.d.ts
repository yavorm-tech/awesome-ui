/**
 * Matcher typings for Vitest 5, whose `Assertion<R, T>` signature the upstream
 * jest-dom / vitest-axe augmentations (written for `Assertion<T>`) no longer match.
 */
import 'vitest';

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import type { AxeMatchers } from 'vitest-axe/matchers';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- generic params must match vitest's declaration
  interface Matchers<R, T> extends TestingLibraryMatchers<unknown, R>, AxeMatchers {}
}
