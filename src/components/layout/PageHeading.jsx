export default function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <div className="max-w-3xl">
        {eyebrow && <p className="mb-4 text-xs uppercase tracking-[0.18em] text-muted">{eyebrow}</p>}
        <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">{title}</h1>
        {description && <p className="mt-5 max-w-xl text-base leading-7 text-muted">{description}</p>}
      </div>
      {children}
    </div>
  )
}
