# Project brief: React component library (`@awesome-ui/ui`)

> Package scope chosen: **`@awesome-ui`** (replaces `@yourorg` throughout). Packages are published as `@awesome-ui/tokens`, `@awesome-ui/core`, `@awesome-ui/react`, `@awesome-ui/forms`, `@awesome-ui/data-grid`, `@awesome-ui/date-pickers`, `@awesome-ui/charts`.

You are building a production-quality React component library, similar in scope to Material UI, styled with Tailwind CSS using Flowbite's design language, and using TanStack libraries for data-heavy and form logic. Work in phases. **Do not start a phase until the previous one is complete and I have approved it.** Start in plan mode: read this whole file, propose the plan for Phase 0, and wait for my approval.

---

## 1. Tech stack (fixed — do not substitute without asking)

| Concern | Choice |
|---|---|
| Language | TypeScript, `strict: true`, no `any` in public APIs |
| UI | React 19 (support React 18 as peer) |
| Styling | Tailwind CSS v4, Flowbite design language and default palette as Theme 1 |
| Variants | `tailwind-variants` |
| Class merging | `tailwind-merge` (via tailwind-variants) |
| Positioning | `@floating-ui/react` (Popover, Popper, Tooltip, Menu, Select, Autocomplete) |
| Accessibility behavior | `react-aria` hooks where a component needs keyboard/focus/ARIA logic (Menu, Select, Tabs, Modal, Slider, Date pickers, Radio, Checkbox) |
| Tables / grids | `@tanstack/react-table` |
| Virtualization | `@tanstack/react-virtual` (Data Grid, Autocomplete/Typeahead with large option lists, List) |
| Forms | `@tanstack/react-form` + Standard Schema validators (support `zod` and `valibot`) |
| Dates | `date-fns` + `react-aria` / `@internationalized/date` calendar logic; locales `en`, `bg` |
| Charts | `recharts`, wrapped in themed components |
| Monorepo | pnpm workspaces + Turborepo |
| Build | `tsup` (ESM + CJS + `.d.ts`), `"sideEffects": ["*.css"]` |
| Dev / docs | Storybook 8+ with `@storybook/addon-a11y` and a theme switcher toolbar |
| Tests | Vitest + Testing Library + `vitest-axe`; Playwright for interaction and visual regression |
| Lint / format | ESLint (typescript-eslint, jsx-a11y, react-hooks), Prettier |
| Release | Changesets |

---

## 2. Repository structure

```
ui-kit/
├── packages/
│   ├── tokens/        design tokens → CSS variables, Tailwind v4 theme, 3 themes
│   ├── core/          ThemeProvider, createTheme, useTheme, slot/override system, utils
│   ├── react/         all standard components (one folder per component)
│   ├── forms/         Form system built on TanStack Form
│   ├── data-grid/     Data Grid (separate bundle)
│   ├── date-pickers/  date & time pickers (separate bundle)
│   └── charts/        chart components (separate bundle)
├── apps/
│   ├── storybook/
│   └── playground/    Vite app that uses the built packages like a real consumer
├── CLAUDE.md          conventions (create in Phase 0 from Section 6 below)
└── PROJECT_PROMPT.md  this file
```

---

## 3. Theming system (the core requirement)

Users must be able to pick a built-in theme, create their own, and override any component's look without forking the library.

### 3.1 Tokens
All visual values are CSS custom properties, mapped into Tailwind v4's `@theme`. Components only use token-based classes (`bg-primary-600`, `rounded-[--radius-control]`, etc.) — **never hard-coded hex values or arbitrary spacing.**

Token groups: `color` (primary, secondary, neutral, success, warning, danger, info — each 50–950, plus semantic `surface`, `surface-raised`, `border`, `text`, `text-muted`, `focus-ring`), `radius` (`none, sm, control, card, pill`), `spacing scale`, `font` (`sans, mono`, sizes, weights, line heights), `shadow` (`sm, md, lg, overlay`), `motion` (durations, easings), `density` (`control-height-sm/md/lg`, paddings), `z-index` layers (dropdown, sticky, modal, popover, snackbar, tooltip).

Every theme defines both **light and dark** modes.

### 3.2 Three built-in themes — they must look clearly different
1. **`flowbite`** (default) — Flowbite's default look exactly: Flowbite blue primary, gray neutrals, Inter, `rounded-lg` controls, standard Flowbite shadows and spacing.
2. **`slate-pro`** — dense and sharp, for dashboards and admin tools: slate neutrals with indigo primary, 2–4px radii, thin 1px borders instead of shadows, compact control heights, IBM Plex Sans, smaller base font.
3. **`soft`** — friendly and spacious: warm palette (coral primary, teal secondary, warm stone neutrals), large radii (12–16px, pill buttons), soft diffused shadows, roomy padding, taller controls, Manrope.

All three fonts must support Cyrillic. The difference must come **only from tokens and theme-level component overrides** — no component code may check which theme is active. If a theme needs a code change, the token system is wrong; fix the system.

### 3.3 API
- `<ThemeProvider theme={theme} mode="light" | "dark" | "system">` — applies CSS variables on a wrapper (support nested providers for scoped theming).
- `createTheme(base, overrides)` — deep-merges token and component overrides, fully typed.
- `useTheme()` — read current theme and mode; `setMode()`.
- Theme switching swaps CSS variables only; no full re-render of the tree.

### 3.4 Component overrides (three levels)
1. **Theme level:** `theme.components.Button = { defaultProps: { variant: 'outline' }, slots: { root: '...', icon: '...' }, variants: { ... } }`.
2. **Instance level:** `className` (applies to root) and `slotClassNames={{ root, label, icon, ... }}`.
3. **Token level:** override CSS variables on any element (`style={{ '--color-primary-600': '...' }}`).

Every component documents its slots. Class conflicts are resolved with `tailwind-merge` so user classes always win.

---

## 4. Components

Each component: typed props, `ref` forwarding, `className` + `slotClassNames`, `size` (`sm | md | lg`) and `color` where relevant, controlled **and** uncontrolled modes for stateful inputs, full keyboard support, correct ARIA, works in all 3 themes in light and dark.

### Inputs
- **Button** — variants `solid | outline | ghost | link`, loading state, start/end icon, full width, `asChild`/polymorphic `as`.
- **ToggleButton / ToggleButtonGroup** — a group of buttons with a selected state; `exclusive` (single) or multiple selection; acts like a segmented control. **Distinct from Switch.**
- **Input** — the **bare** field only: no label, no helper text. Supports start/end adornments, `type`, clearable.
- **TextInput** — composes Input with **label, helper text, error message, required marker, character counter**, all wired with `aria-describedby` / `aria-invalid`.
- **Checkbox** (incl. indeterminate), **Radio / RadioGroup**, **Switch**.
- **Select** — single and multiple, custom option rendering, groups, keyboard typeahead within options.
- **Slider** — single and range, marks, step, vertical.
- **Autocomplete** — free solo or strict, single/multiple (multiple renders Chips), async options with debounced loading and cancellation, virtualized for large lists. **Typeahead** is Autocomplete in async search mode; export a `Typeahead` convenience wrapper.

### Data display
- **DataTable** — built on TanStack Table: sorting, filtering, pagination (client and server), row selection, column visibility, density toggle, sticky header, empty/loading/error states, and a **customizable toolbar** with slots for: search, filter controls, column picker, density, export (CSV), bulk actions on selected rows, and user-supplied custom controls.
- **Avatar** (image, initials, fallback icon, group with overflow count), **Badge** (dot and count, max), **Chip** (deletable, clickable, with avatar/icon), **List** (items, nested, with icons/actions/secondary text, virtualized option), **Tooltip**, **Icon** (wrapper around SVG icons with size/color tokens; ship a small built-in set, allow any SVG/icon library), **Divider** (horizontal/vertical, with text), **Skeleton** (text, circle, rect, animated).

### Feedback
- **Alert** (severity, title, action, dismissible), **Backdrop**, **Progress** (linear and circular, determinate and indeterminate), **Snackbar** (imperative `useSnackbar()` API with a queue, positions, auto-hide, action button, pause on hover).

### Surfaces
- **Accordion** (single/multiple expand, controlled), **Card** (header, media, content, actions slots), **AppBar** (static/sticky/fixed, with slots for brand, nav, actions).

### Navigation
- **Link**, **Breadcrumbs** (with collapse), **Tabs** (horizontal/vertical, scrollable, keyboard arrows), **Pagination** (siblings/boundaries, sizes), **Menu** (nested submenus, keyboard navigation, checkable items), **Menubar**, **Navigation** (side drawer: permanent / persistent / temporary, collapsible mini variant; bottom navigation for mobile), **Stepper** (horizontal/vertical, linear/non-linear, error state).

### Layout
- **Box** (polymorphic, token-based spacing props), **Container** (max widths), **Grid** (CSS grid, responsive columns), **Stack** (direction, gap, divider, responsive), **ImageList** (standard, quilted, masonry).

### Utils
- **Modal / Dialog** (focus trap, scroll lock, nested modals, sizes), **Popover**, **Popper** (low-level positioning primitive), plus internal `Portal` and `FocusTrap`.

### Others (separate packages)
- **DataGrid** (`@awesome-ui/data-grid`) — everything DataTable does plus: row and column virtualization (100k+ rows), inline cell editing with validation, column resize/reorder/pinning, grouping and aggregation, server-side mode (sorting, filtering, pagination callbacks), keyboard cell navigation, copy to clipboard.
- **Date & time pickers** (`@awesome-ui/date-pickers`) — Calendar, DatePicker, TimePicker, DateTimePicker, DateRangePicker; min/max/disabled dates; locales `en` and `bg`; keyboard accessible; integrate with the Form system.
- **Charts** (`@awesome-ui/charts`) — Line, Bar, Area, Pie/Donut, Sparkline; colors, fonts, grid and tooltips come from theme tokens and switch with the theme.
- **Timeline** — vertical/alternate, with icons, dots and content slots.

---

## 5. Form system (`@awesome-ui/forms`)

A reusable form layer so any form can be declared quickly and is **fully validated before submission**.

- `<Form form={form} onSubmit={...}>` built on TanStack Form.
- `useAppForm({ defaultValues, validators })` — accepts a zod or valibot schema (Standard Schema) for whole-form validation, plus per-field validators.
- Field components bound to the form by `name`, which render the matching library input and wire up value, `onChange`, `onBlur`, error and `aria-invalid` automatically:
  `Form.TextField`, `Form.Typeahead`, `Form.Autocomplete`, `Form.Select`, `Form.Checkbox`, `Form.CheckboxGroup`, `Form.RadioGroup`, `Form.Switch`, `Form.Slider`, `Form.ToggleButtonGroup`, `Form.DatePicker`, `Form.TimePicker`.
- Validation behavior:
  - validate on blur and on change after first blur; validate everything on submit;
  - **submission is blocked while any field is invalid or async validation is pending**;
  - async validators (e.g. "is this username taken") with debounce and cancellation;
  - cross-field validation (e.g. password confirmation, date ranges);
  - on failed submit, focus the first invalid field and show an optional `Form.ErrorSummary` with links to each invalid field.
- `Form.Submit` (disabled/loading states), `Form.Reset`, field arrays (`Form.FieldArray` for repeatable groups), and dirty/touched state.
- Error messages localizable (`en`, `bg`).
- Ship at least three example forms in Storybook: registration (async username check, password confirm), contact form, and a multi-step form inside a Stepper.

---

## 6. Conventions (put these in `CLAUDE.md` in Phase 0)

- One folder per component: `Component.tsx`, `Component.styles.ts` (tailwind-variants), `Component.types.ts`, `Component.stories.tsx`, `Component.test.tsx`, `index.ts`.
- Named exports only. Props interfaces exported as `ComponentProps`.
- All styles in `*.styles.ts` with slots; no inline Tailwind strings scattered in JSX.
- No hard-coded colors, radii, shadows or spacing outside `packages/tokens`.
- Every interactive component has a visible focus ring from the `focus-ring` token.
- Respect `prefers-reduced-motion`.
- Support RTL via logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`).
- No new runtime dependencies without asking me.
- Public API changes require a Changeset.

### Definition of done (every component)
1. Typed API, ref forwarding, controlled + uncontrolled where stateful.
2. Slots documented; theme-level and instance-level overrides work.
3. Storybook stories: default, all variants/sizes/colors, states (disabled, error, loading), and a "themes" story showing it in all 3 themes, light and dark.
4. Unit tests: rendering, interaction, keyboard behavior, controlled mode.
5. `vitest-axe` passes with no violations; manual keyboard check described in the PR.
6. Lint, typecheck and tests pass.
7. Short docs (usage, props table, accessibility notes).

---

## 7. Phases

Stop at the end of each phase, summarize what was done, list open questions, and wait for my approval.

| # | Phase | Deliverables |
|---|---|---|
| 0 | Foundation | Monorepo, tsup builds, Storybook with theme switcher, Vitest, Playwright, ESLint/Prettier, CI workflow, Changesets, `CLAUDE.md` |
| 1 | Tokens & theming | Token schema, 3 themes (light + dark), ThemeProvider, createTheme, useTheme, override system, a "Theme tokens" Storybook page |
| 2 | Reference components | **Button, Input, TextInput** done perfectly — these are the pattern every other component follows. I review them before anything else is built. |
| 3 | Layout | Box, Container, Grid, Stack, Divider, ImageList |
| 4 | Basic inputs | ToggleButton(Group), Checkbox, Radio(Group), Switch, Slider, Icon, Tooltip, Chip |
| 5 | Complex inputs | Select, Autocomplete, Typeahead |
| 6 | Utils & feedback | Portal, Popper, Popover, Modal, Backdrop, Alert, Progress, Skeleton, Snackbar |
| 7 | Surfaces & data display | Card, Accordion, AppBar, Avatar, Badge, List |
| 8 | Navigation | Link, Breadcrumbs, Tabs, Pagination, Menu, Menubar, Navigation, Stepper |
| 9 | Form system | `@awesome-ui/forms` with all field bindings and the 3 example forms |
| 10 | DataTable | DataTable with the customizable toolbar |
| 11 | Date & time pickers | `@awesome-ui/date-pickers`, plus Form bindings |
| 12 | DataGrid | `@awesome-ui/data-grid` |
| 13 | Charts & Timeline | `@awesome-ui/charts`, Timeline |
| 14 | Docs & release | Docs site, playground app using built packages, theme builder page, visual regression baseline for all 3 themes, v1.0.0 release |

---

## 8. How to work

- Use plan mode at the start of each phase: write the plan and a short API spec per component (props, slots, keyboard map, ARIA roles), then wait for approval.
- Build one component at a time and run tests after each. Fix failures yourself before moving on.
- After Phase 2, every new component must follow the Button/Input/TextInput patterns; read them before writing a new one.
- If a requirement is ambiguous or two requirements conflict, ask instead of guessing.
- Keep a `PROGRESS.md` checklist of every component and its definition-of-done status, updated at the end of each session.
