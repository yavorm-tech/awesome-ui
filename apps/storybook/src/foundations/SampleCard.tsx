/** A small token-only UI sample used to compare themes. Not a library component. */
export function SampleCard() {
  return (
    <article className="rounded-card border-border bg-surface-raised p-card-p text-text border shadow-md">
      <h3 className="mb-1 text-lg font-semibold">Профил · Profile</h3>
      <p className="text-text-muted mb-4 text-sm">Same markup, different tokens.</p>
      <label className="mb-1 block text-sm font-medium" htmlFor={undefined}>
        Email
        <input
          className="h-control-md rounded-control border-border-strong bg-surface-sunken text-text focus-visible:ring-focus-ring mt-1 block w-full border px-3 text-sm outline-none focus-visible:ring-4"
          defaultValue="ivan@example.com"
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="h-control-md rounded-control bg-primary-solid px-control-px-md text-primary-on-solid hover:bg-primary-solid-hover focus-visible:ring-focus-ring text-sm font-medium focus-visible:ring-4 focus-visible:outline-none"
        >
          Save
        </button>
        <button
          type="button"
          className="h-control-md rounded-control border-primary-outline px-control-px-md text-primary-on-soft hover:bg-primary-soft focus-visible:ring-focus-ring border text-sm font-medium focus-visible:ring-4 focus-visible:outline-none"
        >
          Cancel
        </button>
        <span className="rounded-pill bg-success-soft text-success-on-soft inline-flex items-center px-3 text-xs font-medium">
          Active
        </span>
      </div>
    </article>
  );
}
