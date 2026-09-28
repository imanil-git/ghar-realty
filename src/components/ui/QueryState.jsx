import Button from "./Button";

export default function QueryState({ query, children }) {
  if (query.isPending)
    return (
      <div
        role="status"
        aria-label="Loading"
        className="grid gap-4 sm:grid-cols-2"
      >
        <div className="h-48 bg-surface motion-safe:animate-pulse" />
        <div className="h-48 bg-surface motion-safe:animate-pulse" />
        <span className="sr-only">Loading…</span>
      </div>
    );
  if (query.isError)
    return (
      <div className="border border-border p-6">
        <p role="alert" className="mb-4 text-error">
          {query.error.message}
        </p>
        <Button variant="secondary" onClick={() => query.refetch()}>
          Try again
        </Button>
      </div>
    );
  return children(query.data);
}
