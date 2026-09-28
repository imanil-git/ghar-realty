import { useId } from "react";

export default function Checkbox({
  label,
  hint,
  error,
  id,
  required,
  className = "",
  ...props
}) {
  const generatedId = useId();
  const checkboxId = id || generatedId;
  const description = [
    props["aria-describedby"],
    hint && `${checkboxId}-hint`,
    error && `${checkboxId}-error`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`grid gap-1 ${className}`}>
      <label
        htmlFor={checkboxId}
        className="flex min-h-11 items-center gap-3 text-sm"
      >
        <input
          {...props}
          id={checkboxId}
          type="checkbox"
          required={required}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={description || undefined}
          className="size-5 shrink-0 accent-action disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className={props.disabled ? "text-muted" : ""}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </span>
      </label>
      {hint && (
        <p id={`${checkboxId}-hint`} className="pl-8 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${checkboxId}-error`}
          role="alert"
          className="pl-8 text-sm text-error"
        >
          {error}
        </p>
      )}
    </div>
  );
}
