import type { Meta, StoryObj } from '@storybook/react-vite';

/** Pipeline check for Tailwind, tokens, the theme decorator and the a11y addon. Removed in Phase 2. */
function SmokeCard() {
  return (
    <section className="max-w-sm rounded-card border border-border bg-surface-raised p-card-p shadow-md">
      <h2 className="mb-2 text-xl font-bold text-fg">Tooling smoke test</h2>
      <p className="text-fg-muted">
        If this card is styled, Tailwind v4 and the tokens are wired up. Кирилицата също работи.
      </p>
    </section>
  );
}

const meta = {
  title: 'Internal/Smoke',
  component: SmokeCard,
  parameters: { padded: true },
} satisfies Meta<typeof SmokeCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
