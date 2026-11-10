/** A small token-only UI sample used to compare themes. Not a library component. */
export function SampleCard() {
  return (
    <article className="rounded-card border border-border bg-surface-raised p-card-p text-fg shadow-md">
      <h3 className="mb-1 text-lg font-semibold">Профил · Profile</h3>
      <p className="mb-4 text-sm text-fg-muted">Same markup, different tokens.</p>
      <label className="mb-1 block text-sm font-medium" htmlFor={undefined}>
        Email
        <input
          className="mt-1 block h-control-md w-full rounded-control border border-border-strong bg-surface-sunken px-3 text-sm text-fg outline-none focus-visible:ring-4 focus-visible:ring-focus-ring"
          defaultValue="ivan@example.com"
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="h-control-md rounded-control bg-primary-solid px-control-px-md text-sm font-medium text-primary-on-solid hover:bg-primary-solid-hover focus-visible:ring-4 focus-visible:ring-focus-ring focus-visible:outline-none"
        >
          Save
        </button>
        <button
          type="button"
          className="h-control-md rounded-control border border-primary-outline px-control-px-md text-sm font-medium text-primary-on-soft hover:bg-primary-soft focus-visible:ring-4 focus-visible:ring-focus-ring focus-visible:outline-none"
        >
          Cancel
        </button>
        <span className="inline-flex items-center rounded-pill bg-success-soft px-3 text-xs font-medium text-success-on-soft">
          Active
        </span>
      </div>
    </article>
  );
}
