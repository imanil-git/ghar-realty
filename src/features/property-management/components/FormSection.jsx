export default function FormSection({
  id,
  number,
  title,
  description,
  children,
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-32 ${number ? "border-t border-border py-9" : "pb-8"}`}
    >
      <div className="mb-6">
        {number && <p className="mb-2 text-xs text-muted">{number}</p>}
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description && (
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        )}
      </div>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}
