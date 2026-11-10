import { PACKAGE_NAME as charts } from '@awesome-ui/charts';
import { type BuiltInThemeName, builtInThemes, ThemeProvider, useTheme } from '@awesome-ui/core';
import { PACKAGE_NAME as dataGrid } from '@awesome-ui/data-grid';
import { PACKAGE_NAME as datePickers } from '@awesome-ui/date-pickers';
import { PACKAGE_NAME as forms } from '@awesome-ui/forms';
import { Button, Input, TextInput } from '@awesome-ui/react';
import { type SyntheticEvent, useState } from 'react';

const placeholders = [forms, dataGrid, datePickers, charts];

function ModeToggle() {
  const { resolvedMode, setMode } = useTheme();
  return (
    <Button
      variant="outline"
      color="neutral"
      size="sm"
      onClick={() => {
        setMode(resolvedMode === 'dark' ? 'light' : 'dark');
      }}
    >
      {resolvedMode === 'dark' ? 'Light mode' : 'Dark mode'}
    </Button>
  );
}

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const emailError =
    submitted && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter a valid email address.' : undefined;

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
    }, 1500);
  };

  return (
    <form className="grid gap-4" noValidate onSubmit={onSubmit}>
      <TextInput label="Full name" name="name" required autoComplete="name" />
      <TextInput
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        helperText="We never share it."
        errorMessage={emailError}
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />
      <TextInput label="Bio" name="bio" showCount maxLength={80} clearable />
      <div className="flex gap-3">
        <Button type="submit" loading={saving} loadingText="Saving…">
          Create account
        </Button>
        <Button type="reset" variant="ghost" color="neutral">
          Reset
        </Button>
      </div>
    </form>
  );
}

export function App() {
  const [name, setName] = useState<BuiltInThemeName>('flowbite');
  return (
    <ThemeProvider theme={builtInThemes[name]} defaultMode="system" className="min-h-screen">
      <main className="mx-auto max-w-xl p-8">
        <h1 className="mb-4 text-2xl font-bold">awesome-ui playground</h1>
        <div className="mb-8 flex items-center gap-3">
          <select
            aria-label="Theme"
            className="h-control-sm rounded-control border border-border-strong bg-surface-sunken px-2 text-sm"
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
          <Input
            aria-label="Search"
            placeholder="Search…"
            size="sm"
            clearable
            className="ms-auto max-w-48"
          />
        </div>
        <SignUpForm />
        <p className="mt-10 mb-2 text-sm text-fg-muted">Packages still to come:</p>
        <ul className="list-disc ps-6 text-sm text-fg-muted">
          {placeholders.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </main>
    </ThemeProvider>
  );
}
