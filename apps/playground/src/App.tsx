import { PACKAGE_NAME as charts } from '@awesome-ui/charts';
import { PACKAGE_NAME as core } from '@awesome-ui/core';
import { PACKAGE_NAME as dataGrid } from '@awesome-ui/data-grid';
import { PACKAGE_NAME as datePickers } from '@awesome-ui/date-pickers';
import { PACKAGE_NAME as forms } from '@awesome-ui/forms';
import { PACKAGE_NAME as react } from '@awesome-ui/react';
import { PACKAGE_NAME as tokens } from '@awesome-ui/tokens';

const packages = [tokens, core, react, forms, dataGrid, datePickers, charts];

export function App() {
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-4 text-2xl font-bold">awesome-ui playground</h1>
      <p className="mb-2">Resolved from built packages:</p>
      <ul className="list-disc ps-6">
        {packages.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </main>
  );
}
