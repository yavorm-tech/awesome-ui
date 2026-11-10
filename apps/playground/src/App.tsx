import { PACKAGE_NAME as charts } from '@awesome-ui/charts';
import { type BuiltInThemeName, builtInThemes, ThemeProvider, useTheme } from '@awesome-ui/core';
import { PACKAGE_NAME as dataGrid } from '@awesome-ui/data-grid';
import { PACKAGE_NAME as datePickers } from '@awesome-ui/date-pickers';
import { PACKAGE_NAME as forms } from '@awesome-ui/forms';
import { PACKAGE_NAME as react } from '@awesome-ui/react';
import { useState } from 'react';

const placeholders = [react, forms, dataGrid, datePickers, charts];

function ModeToggle() {
  const { resolvedMode, setMode } = useTheme();
  return (
    <button
      type="button"
      className="h-control-sm rounded-control border-border-strong px-control-px-sm border text-sm"
      onClick={() => {
        setMode(resolvedMode === 'dark' ? 'light' : 'dark');
      }}
    >
      {resolvedMode === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  );
}

export function App() {
  const [name, setName] = useState<BuiltInThemeName>('flowbite');
  return (
    <ThemeProvider theme={builtInThemes[name]} defaultMode="system" className="min-h-screen">
      <main className="mx-auto max-w-xl p-8">
        <h1 className="mb-4 text-2xl font-bold">awesome-ui playground</h1>
        <div className="mb-6 flex items-center gap-3">
          <select
            aria-label="Theme"
            className="h-control-sm rounded-control border-border-strong bg-surface-sunken border px-2 text-sm"
            value={name}
            onChange={(e) => {
              setName(e.target.value as BuiltInThemeName);
            }}
          >
            {Object.keys(builtInThemes).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <ModeToggle />
        </div>
        <p className="text-text-muted mb-2">Packages resolved from their built output:</p>
        <ul className="list-disc ps-6">
          <li>@awesome-ui/tokens, @awesome-ui/core (theming)</li>
          {placeholders.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </main>
    </ThemeProvider>
  );
}
