import Button from "./Button";

export default function Pagination({ page, pages, onChange }) {
  if (pages < 2 && page === 1) return null;
  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-4"
    >
      <Button
        variant="secondary"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm">
        Page {page} of {Math.max(pages, 1)}
      </span>
      <Button
        variant="secondary"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
