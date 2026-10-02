export default function ResultsPagination({ page, pages, onChange }) {
  if (pages < 2 && page === 1) return null;
  const start = Math.max(1, Math.min(page - 1, pages - 3));
  const numbers = Array.from(
    { length: Math.min(4, pages) },
    (_, index) => start + index,
  );
  const base =
    "flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-border px-3 text-sm";
  return (
    <nav aria-label="Pagination" className="mt-7 flex flex-wrap gap-2">
      {page > 1 && (
        <button className={base} onClick={() => onChange(page - 1)}>
          ← Previous
        </button>
      )}
      {numbers.map((number) => (
        <button
          key={number}
          aria-label={`Page ${number}`}
          aria-current={page === number ? "page" : undefined}
          className={`${base} ${page === number ? "bg-action text-on-action" : "bg-background"}`}
          onClick={() => onChange(number)}
        >
          {number}
        </button>
      ))}
      {page < pages && (
        <button className={base} onClick={() => onChange(page + 1)}>
          Next →
        </button>
      )}
    </nav>
  );
}
