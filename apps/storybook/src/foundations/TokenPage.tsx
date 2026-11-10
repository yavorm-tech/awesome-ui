import { useTheme } from '@awesome-ui/core';
import {
  CONTROL_SIZES,
  cssVar,
  DURATIONS,
  EASINGS,
  FONT_WEIGHTS,
  type IntentRoles,
  INTENTS,
  PALETTE_STEPS,
  RADII,
  SEMANTIC_COLORS,
  SHADOWS,
  TEXT_SIZES,
  Z_LAYERS,
} from '@awesome-ui/tokens';
import type { ReactNode } from 'react';

const ROLE_KEYS: (keyof IntentRoles)[] = [
  'solid',
  'solidHover',
  'onSolid',
  'soft',
  'onSoft',
  'outline',
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 border-b border-border pb-2 text-xl font-semibold text-fg">{title}</h2>
      {children}
    </section>
  );
}

function Swatch({ variable, label, value }: { variable: string; label: string; value: string }) {
  return (
    <figure className="m-0 min-w-0">
      <div
        className="h-12 rounded-sm border border-border"
        style={{ background: `var(${variable})` }}
        title={variable}
      />
      <figcaption className="mt-1 text-xs text-fg">
        <span className="block truncate font-medium">{label}</span>
        <code className="block truncate font-mono text-fg-muted">{value}</code>
      </figcaption>
    </figure>
  );
}

/** Live view of every token in the active theme and mode, rendered through the CSS variables. */
export function TokenPage() {
  const { theme, resolvedMode } = useTheme();
  const { shared } = theme.tokens;
  const mode = theme.tokens[resolvedMode];

  return (
    <div className="mx-auto max-w-6xl p-6 text-fg">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Theme tokens</h1>
        <p className="text-fg-muted">
          Theme <code className="font-mono">{theme.name}</code>, {resolvedMode} mode. Switch with
          the toolbar. Every swatch is painted from its CSS variable, so it shows exactly what
          components get.
        </p>
      </header>

      <Section title="Semantic colors (swap per mode)">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {SEMANTIC_COLORS.map((name) => (
            <Swatch
              key={name}
              variable={cssVar.color(name)}
              label={name}
              value={mode.colors[name]}
            />
          ))}
        </div>
      </Section>

      <Section title="Intent roles (swap per mode)">
        <div className="space-y-4">
          {INTENTS.map((intent) => (
            <div key={intent}>
              <h3 className="mb-2 text-sm font-semibold capitalize">{intent}</h3>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {ROLE_KEYS.map((role) => (
                  <Swatch
                    key={role}
                    variable={cssVar.role(intent, role)}
                    label={role}
                    value={mode.intents[intent][role]}
                  />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                <span
                  className="rounded-control px-control-px-sm py-1"
                  style={{
                    background: `var(${cssVar.role(intent, 'solid')})`,
                    color: `var(${cssVar.role(intent, 'onSolid')})`,
                  }}
                >
                  On solid
                </span>
                <span
                  className="rounded-control px-control-px-sm py-1"
                  style={{
                    background: `var(${cssVar.role(intent, 'soft')})`,
                    color: `var(${cssVar.role(intent, 'onSoft')})`,
                  }}
                >
                  On soft
                </span>
                <span
                  className="rounded-control border px-control-px-sm py-1"
                  style={{
                    borderColor: `var(${cssVar.role(intent, 'outline')})`,
                    color: `var(${cssVar.role(intent, 'onSoft')})`,
                  }}
                >
                  Outline
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Palettes">
        <div className="space-y-3">
          {INTENTS.map((intent) => (
            <div key={intent} className="grid grid-cols-[6rem_1fr] items-center gap-3">
              <span className="text-sm font-medium capitalize">{intent}</span>
              <div className="grid grid-cols-11 gap-1">
                {PALETTE_STEPS.map((step) => (
                  <Swatch
                    key={step}
                    variable={cssVar.palette(intent, step)}
                    label={String(step)}
                    value={shared.palettes[intent][step]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius">
        <div className="flex flex-wrap gap-6">
          {RADII.map((r) => (
            <div key={r} className="text-center text-xs">
              <div
                className="mb-1 size-20 border-2 border-primary-outline bg-primary-soft"
                style={{ borderRadius: `var(${cssVar.radius(r)})` }}
              />
              <div className="font-medium">{r}</div>
              <code className="font-mono text-fg-muted">{shared.radii[r]}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shadow (swap per mode)">
        <div className="flex flex-wrap gap-8 bg-surface-sunken p-6">
          {SHADOWS.map((s) => (
            <div
              key={s}
              className="flex size-28 items-center justify-center rounded-card bg-surface-raised text-sm"
              style={{ boxShadow: `var(${cssVar.shadow(s)})` }}
            >
              {s}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <p className="mb-4 text-sm text-fg-muted">
          sans: <code className="font-mono">{shared.fonts.sans}</code>
        </p>
        <div className="space-y-2">
          {TEXT_SIZES.map((size) => (
            <div key={size} className="grid grid-cols-[8rem_1fr] items-baseline gap-4">
              <code className="font-mono text-xs text-fg-muted">
                {size} · {shared.text[size].size}/{shared.text[size].lineHeight}
              </code>
              <span
                style={{
                  fontSize: `var(${cssVar.text(size)})`,
                  lineHeight: `var(${cssVar.lineHeight(size)})`,
                }}
              >
                The quick brown fox · Бързата кафява лисица
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          {FONT_WEIGHTS.map((w) => (
            <span key={w} style={{ fontWeight: `var(${cssVar.fontWeight(w)})` }}>
              {w} · Шрифт
            </span>
          ))}
          <code className="font-mono">mono · 0123456789</code>
        </div>
      </Section>

      <Section title="Density">
        <div className="space-y-3">
          {CONTROL_SIZES.map((size) => (
            <div key={size} className="flex items-center gap-4">
              <code className="w-48 font-mono text-xs text-fg-muted">
                control-{size}: {shared.density.controlHeight[size]} · px{' '}
                {shared.density.controlPaddingX[size]}
              </code>
              <div
                className="flex items-center rounded-control border border-border-strong bg-surface-sunken text-sm"
                style={{
                  height: `var(${cssVar.controlHeight(size)})`,
                  paddingInline: `var(${cssVar.controlPaddingX(size)})`,
                }}
              >
                Control {size}
              </div>
            </div>
          ))}
          <code className="block font-mono text-xs text-fg-muted">
            card padding: {shared.density.cardPadding} · spacing base: {shared.spacing}
          </code>
        </div>
      </Section>

      <Section title="Motion">
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {DURATIONS.map((d) => (
            <li key={d}>
              <code className="font-mono">--duration-{d}</code>: {shared.motion.durations[d]}
            </li>
          ))}
          {EASINGS.map((e) => (
            <li key={e}>
              <code className="font-mono">--ease-{e}</code>: {shared.motion.easings[e]}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Z-index layers">
        <ul className="flex flex-wrap gap-4 text-sm">
          {Z_LAYERS.map((layer) => (
            <li key={layer}>
              <code className="font-mono">--z-{layer}</code>: {shared.zIndex[layer]}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
