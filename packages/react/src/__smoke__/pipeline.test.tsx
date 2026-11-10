import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { axe } from 'vitest-axe';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount((c) => c + 1)}>
      Clicked {count} times
    </button>
  );
}

describe('test pipeline smoke test', () => {
  it('renders, handles interaction and passes axe', async () => {
    const user = userEvent.setup();
    const { container } = render(<Counter />);

    await user.click(screen.getByRole('button', { name: /clicked 0 times/i }));
    expect(screen.getByRole('button')).toHaveTextContent('Clicked 1 times');

    expect(await axe(container)).toHaveNoViolations();
  });
});
