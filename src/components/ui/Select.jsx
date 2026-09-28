import { useId } from "react";
import FormField from "./FormField";

export default function Select({
  label,
  hint,
  error,
  id,
  required,
  children,
  className = "",
  ...props
}) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const description = [
    props["aria-describedby"],
    hint && `${selectId}-hint`,
    error && `${selectId}-error`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FormField
      id={selectId}
      label={label}
      hint={hint}
      error={error}
      required={required}
    >
      <select
        {...props}
        id={selectId}
        required={required}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={description || undefined}
        className={`form-control ${className}`}
      >
        {children}
      </select>
    </FormField>
  );
}
