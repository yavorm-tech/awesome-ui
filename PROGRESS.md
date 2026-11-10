# Progress

Legend: ✅ done · 🟡 in progress · ⬜ not started

## Phases

| #   | Phase                                           | Status               |
| --- | ----------------------------------------------- | -------------------- |
| 0   | Foundation                                      | 🟡 awaiting approval |
| 1   | Tokens & theming                                | ⬜                   |
| 2   | Reference components (Button, Input, TextInput) | ⬜                   |
| 3   | Layout                                          | ⬜                   |
| 4   | Basic inputs                                    | ⬜                   |
| 5   | Complex inputs                                  | ⬜                   |
| 6   | Utils & feedback                                | ⬜                   |
| 7   | Surfaces & data display                         | ⬜                   |
| 8   | Navigation                                      | ⬜                   |
| 9   | Form system                                     | ⬜                   |
| 10  | DataTable                                       | ⬜                   |
| 11  | Date & time pickers                             | ⬜                   |
| 12  | DataGrid                                        | ⬜                   |
| 13  | Charts & Timeline                               | ⬜                   |
| 14  | Docs & release                                  | ⬜                   |

## Phase 0 checklist

- ✅ pnpm workspaces + Turborepo
- ✅ tsup builds (ESM + CJS + d.ts, `"use client"` banner), publint + attw clean
- ✅ Storybook 10 with a11y addon, Tailwind v4, theme/mode toolbar (placeholder decorator)
- ✅ Vitest + Testing Library + vitest-axe
- ✅ Playwright (Chromium) against static Storybook, with axe
- ✅ ESLint (typescript-eslint strict, react, react-hooks, jsx-a11y) + Prettier
- ✅ GitHub Actions CI workflow (not run yet, no remote)
- ✅ Changesets
- ✅ CLAUDE.md, PROJECT_PROMPT.md, playground app

## Phase 1 checklist

- ✅ Token schema (palettes, semantic colors, intent roles, radius, typography, shadow, density, motion, z-index)
- ✅ Themes `flowbite`, `slate-pro`, `soft`, light + dark, WCAG AA text contrast tested
- ✅ Opt-in self-hosted fonts with Cyrillic (`@awesome-ui/tokens/fonts/*.css`)
- ✅ Generated `theme.css` (Tailwind `@theme`) and `themes.css` (static scoped themes)
- ✅ `ThemeProvider` (nested, light/dark/system, controlled/uncontrolled, style injection), `createTheme`, `useTheme`
- ✅ Override system: `ComponentOverrideMap`, `useComponentProps`, `useSlotClasses`, token-aware `tv` / `cn`
- ✅ `scripts/check-tokens.mjs` enforcement in `pnpm lint`
- ✅ Storybook: real ThemeProvider decorator, Foundations/Theme tokens (+ Compare), Foundations/Overrides
- ✅ Tests: 158 unit, 12 e2e

## Components — Definition of Done

Columns: **API** typed/ref/controlled · **Slots** documented + overrides · **Stories** incl. Themes · **Tests** unit · **a11y** axe + keyboard check · **CI** lint/type/test · **Docs**

| Component                                         | Phase | API | Slots | Stories | Tests | a11y | CI  | Docs |
| ------------------------------------------------- | ----- | --- | ----- | ------- | ----- | ---- | --- | ---- |
| Button                                            | 2     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Input                                             | 2     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| TextInput                                         | 2     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Box                                               | 3     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Container                                         | 3     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Grid                                              | 3     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Stack                                             | 3     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Divider                                           | 3     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| ImageList                                         | 3     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| ToggleButton                                      | 4     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| ToggleButtonGroup                                 | 4     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Checkbox                                          | 4     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Radio                                             | 4     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| RadioGroup                                        | 4     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Switch                                            | 4     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Slider                                            | 4     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Icon                                              | 4     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Tooltip                                           | 4     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Chip                                              | 4     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Select                                            | 5     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Autocomplete                                      | 5     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Typeahead                                         | 5     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Portal                                            | 6     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Popper                                            | 6     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Popover                                           | 6     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Modal / Dialog                                    | 6     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Backdrop                                          | 6     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Alert                                             | 6     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Progress                                          | 6     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Skeleton                                          | 6     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Snackbar                                          | 6     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Card                                              | 7     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Accordion                                         | 7     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| AppBar                                            | 7     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Avatar                                            | 7     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Badge                                             | 7     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| List                                              | 7     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Link                                              | 8     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Breadcrumbs                                       | 8     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Tabs                                              | 8     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Pagination                                        | 8     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Menu                                              | 8     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Menubar                                           | 8     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Navigation                                        | 8     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Stepper                                           | 8     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Form + field bindings                             | 9     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Form examples (registration, contact, multi-step) | 9     | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| DataTable                                         | 10    | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Calendar                                          | 11    | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| DatePicker                                        | 11    | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| TimePicker                                        | 11    | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| DateTimePicker                                    | 11    | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| DateRangePicker                                   | 11    | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| DataGrid                                          | 12    | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Line chart                                        | 13    | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Bar chart                                         | 13    | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Area chart                                        | 13    | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Pie / Donut chart                                 | 13    | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Sparkline                                         | 13    | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
| Timeline                                          | 13    | ⬜  | ⬜    | ⬜      | ⬜    | ⬜   | ⬜  | ⬜   |
