export default function EmptyState({ title = "Nothing here yet", children }) {
  return (
    <div className="border border-border bg-surface p-8 text-center sm:p-12">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-4 text-sm leading-6 text-muted">{children}</div>
    </div>
  );
}
