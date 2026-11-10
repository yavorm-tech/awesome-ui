import type { Meta, StoryObj } from '@storybook/react-vite';

/** Pipeline check for Tailwind, the theme decorator and the a11y addon. Removed in Phase 2. */
function SmokeCard() {
  return (
    <section className="max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Tooling smoke test</h2>
      <p className="text-gray-700 dark:text-gray-300">
        If this card is styled, Tailwind v4 is wired up. Кирилица също работи.
      </p>
    </section>
  );
}

const meta = {
  title: 'Internal/Smoke',
  component: SmokeCard,
} satisfies Meta<typeof SmokeCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
