# awesome-ui — working conventions

React component library (`@awesome-ui/*`): Tailwind CSS v4, Flowbite design language, TanStack for data/forms.
Full brief: `PROJECT_PROMPT.md`. Status: `PROGRESS.md`.

## Process rules

- Work in phases (PROJECT_PROMPT.md §7). **Never start a phase until the previous one is approved by the user.**
- Start each phase in plan mode: plan + short API spec per component (props, slots, keyboard map, ARIA roles), then wait for approval.
- Build one component at a time; run tests after each; fix failures before moving on.
- After Phase 2, every new component follows the Button / Input / TextInput patterns — read them first.
- Ambiguous or conflicting requirements → ask, don't guess.
- No new runtime dependencies without asking (the libraries in the brief's §1 stack table are pre-approved).
- Update `PROGRESS.md` at the end of every session.

## Environment

- Node 22 (`.nvmrc`); pnpm via corepack (`packageManager` in root package.json).
  In a fresh shell: `. ~/.nvm/nvm.sh && nvm use 22`.

## Commands (run from repo root)

| Command                        | What                                                                             |
| ------------------------------ | -------------------------------------------------------------------------------- |
| `pnpm build`                   | tsup builds of all packages (ESM + CJS + d.ts) via Turborepo                     |
| `pnpm lint`                    | ESLint (zero warnings) + publint + arethetypeswrong + `scripts/check-tokens.mjs` |
| `pnpm typecheck`               | `tsc --noEmit` in every workspace + root config files                            |
| `pnpm test`                    | Vitest (jsdom, Testing Library, vitest-axe) for `packages/*/src/**/*.test.ts(x)` |
| `pnpm storybook`               | Storybook dev server on :6006                                                    |
| `pnpm build-storybook`         | Static Storybook in `apps/storybook/storybook-static`                            |
| `pnpm test:e2e`                | Playwright (Chromium) against the static Storybook                               |
| `pnpm format` / `format:check` | Prettier (+ Tailwind class sorting)                                              |
| `pnpm changeset`               | Record a public API change                                                       |

## Layout

- `packages/tokens` design tokens → CSS variables, Tailwind v4 theme, 3 themes
- `packages/core` ThemeProvider, createTheme, useTheme, slot/override system, utils
- `packages/react` standard components (one folder per component)
- `packages/forms` · `packages/data-grid` · `packages/date-pickers` · `packages/charts` separate bundles
- `packages/tsup.preset.ts` shared build config (adds `"use client"` banner except for tokens)
- `apps/storybook` docs/dev, theme + mode toolbar, Playwright e2e in `apps/storybook/e2e`
- `apps/playground` Vite app consuming the **built** packages through their `exports`
- `test/` shared Vitest setup and matcher typings

## Code conventions

- One folder per component: `Component.tsx`, `Component.styles.ts` (tailwind-variants), `Component.types.ts`, `Component.stories.tsx`, `Component.test.tsx`, `index.ts`.
- Named exports only (enforced by ESLint; config files and stories excepted). Props interfaces exported as `ComponentProps`.
- All styles in `*.styles.ts` with slots; no inline Tailwind strings scattered in JSX.
- No hard-coded colors, radii, shadows or spacing outside `packages/tokens`.
- No component code may check which theme is active — themes differ only via tokens and theme-level component overrides.
- Every interactive component has a visible focus ring from the `focus-ring` token.
- Respect `prefers-reduced-motion`.
- Support RTL via logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`).
- TypeScript `strict` (+ `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`); no `any` in public APIs.
- Public API changes require a Changeset.

## Theming & token rules

- Source of truth: `packages/tokens/src/themes/*.ts` (values) and `types.ts` (schema). `dist/theme.css` (Tailwind `@theme`) and `dist/themes.css` are generated from them by `scripts/build-css.mjs`; never edit generated CSS.
- Runtime CSS variables use Tailwind v4's own names, so token utilities just work: `bg-primary-600`, `bg-primary-solid hover:bg-primary-solid-hover text-primary-on-solid`, `bg-surface`, `text-fg-muted`, `border-border`, `ring-focus-ring`, `rounded-control`, `shadow-overlay`, `h-control-md px-control-px-md`, `p-card-p`, `ease-standard duration-(--duration-fast)`, `z-(--z-modal)`.
- Prefer **intent roles** (`{intent}-solid/-solid-hover/-on-solid/-soft/-on-soft/-outline`) and **semantic colors** over raw palette steps; they swap per mode.
- **Never use Tailwind's `dark:` variant in library code.** Light/dark differences are tokens. Nested providers rely on this.
- `scripts/check-tokens.mjs` (part of `pnpm lint`) rejects in `packages/*/src` (except tokens, tests, stories): `dark:`, hex/rgb/hsl colors, Tailwind default palette classes (`bg-blue-600`, `text-white`), bracketed lengths (`w-[13px]`). Escape hatch: a `check-tokens-ignore` comment on the line, with a reason.
- New token → add it to `types.ts`, all 3 themes (light + dark where per-mode), `css.ts` (`cssVar` + variables), `twMergeConfig` in `packages/core/src/utils/tv.ts` if it creates a new utility value, and the Theme tokens story.
- Theme-level component overrides: register the component in `ComponentOverrideMap` (declaration merging) and use `useComponentProps(name, props)` + `useSlotClasses(name, recipe(variants), variantProps, { className, slotClassNames })`. Precedence: recipe → theme slots → theme variants → `slotClassNames` → `className`.
- Use `tv` and `cn` from `@awesome-ui/core` (configured with the token-aware merge rules), never `tailwind-variants` directly.
- All WCAG AA text contrast pairs are tested in `packages/tokens/src/__tests__/themes.test.ts`; adjust token values, not tests.

## Component pattern (Button / Input / TextInput are the reference — read them first)

- Files: `Component.tsx`, `.styles.ts`, `.types.ts`, `.stories.tsx`, `.mdx` (docs), `.test.tsx`, `index.ts` in `packages/react/src/Component/`.
- `.types.ts`: exported `ComponentProps`, `ComponentSlot` union, JSDoc on every prop (it becomes the Storybook props table), all optional props typed `| undefined`, and the `declare module '@awesome-ui/core' { interface ComponentOverrideMap { … } }` registration.
- `.styles.ts`: one `tv()` recipe from `@awesome-ui/core` with every slot. Write each class literally. Never build class names from template strings, because Tailwind can't see them. Color × variant combinations go in explicit `compoundVariants` tables that use intent roles. Export the recipe (`buttonStyles`).
- Component body order: `useComponentProps(name, inProps)` → destructure with defaults → `useSlotClasses(name, recipe(variants), variantProps, { className, slotClassNames })` → JSX. `forwardRef` (React 18 support) and a `displayName`.
- Polymorphism: `as` via `PolymorphicProps` / `PolymorphicComponent` and `asChild` via `Slot` from core. Inside `forwardRef`, cast props back to the implementation type, because `Omit<P,'ref'>` erases named props on index-signature types. Don't pass `undefined` props to `Slot`/custom components; filter them out.
- Refs point to the element users interact with (Input/TextInput: the `<input>`). `className` (and `style`) go to the root slot.
- State: native elements stay natively controlled or uncontrolled. Custom state uses `useControllableState`. Derived state of uncontrolled inputs must resync on form reset (`internal/useFormReset`).
- Boolean state for styling goes in `data-*` attributes via `dataAttr()` (`data-disabled`, `data-loading`, `data-invalid`).
- Form fields: a label is required in the types (`label` or `aria-label`/`aria-labelledby`); `aria-describedby` merges helper/error/counter with the user's value; `aria-invalid` + `aria-errormessage`; the error element stays mounted as an `aria-live="polite"` region.
- Disabled styling: only the inactive control and its label may use `text-fg-disabled`. Helper text and counters must keep AA contrast (axe checks them).
- Icons are decorative (`aria-hidden`); internal SVGs live in `packages/react/src/internal/`.
- Stories: `title: 'Group/Component'`, `parameters: { padded: true }`; Playground, variants, sizes, states, Overrides (3 levels), and `Themes` with `parameters: { themeMatrix: true }` (the decorator renders all themes × light/dark). Every story is axe-checked by `apps/storybook/e2e/components.spec.ts` (add the component's title there).
- Docs: `Component.mdx` with `<Meta of={Stories} />`, usage, `<ArgTypes>`, slots table, accessibility notes, Themes canvas.

## Definition of done (every component)

1. Typed API, ref forwarding, controlled + uncontrolled where stateful.
2. Slots documented; theme-level and instance-level overrides work.
3. Storybook stories: default, all variants/sizes/colors, states (disabled, error, loading), and a "Themes" story showing all 3 themes in light and dark.
4. Unit tests: rendering, interaction, keyboard behavior, controlled mode.
5. `vitest-axe` passes with no violations; manual keyboard check described in the PR.
6. Lint, typecheck and tests pass.
7. Short docs (usage, props table, accessibility notes).

## Tooling notes

- Vitest 5 changed `Assertion<T>` to `Assertion<R, T>`; jest-dom/vitest-axe matcher types are declared in `test/matchers.d.ts` instead of their upstream augmentations.
- TypeScript is pinned to 6.0.x (typescript-eslint does not support TS 7 yet). ESLint is pinned to 9.x (eslint-plugin-react / jsx-a11y do not support ESLint 10 yet).
- `tailwind-variants` v4 bundles its own tailwind-merge engine, so `tailwind-merge` is not a separate dependency.
- Consumers must `@source` the built `@awesome-ui` packages in their Tailwind CSS (see `apps/playground/src/index.css`).
- Prettier's Tailwind class sorter reads `apps/storybook/.storybook/preview.css` to learn the token utilities, so run `pnpm build` before `pnpm format` in a fresh clone.
- Foreground text tokens are `fg`, `fg-muted`, `fg-disabled` (classes `text-fg`, `text-fg-muted`), not `text-text`.
- Tailwind's `@source` does not match a glob like `packages/*/src`; point it at a directory (`@source '../../../packages'`). Check new components visually: a missing class fails silently.
- Vitest aliases `@awesome-ui/*` to package sources (`vitest.config.ts`), so unit tests need no build; typecheck, lint and Storybook use the built `dist`, so run `pnpm build` after changing core.
- Storybook's a11y addon runs axe inside the story frame; the e2e `axeViolations` helper retries while it is busy.
