import { useId } from "react";
import FormField from "./FormField";

export default function Textarea({
  label,
  hint,
  error,
  id,
  required,
  rows = 4,
  className = "",
  ...props
}) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const description = [
    props["aria-describedby"],
    hint && `${textareaId}-hint`,
    error && `${textareaId}-error`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FormField
      id={textareaId}
      label={label}
      hint={hint}
      error={error}
      required={required}
    >
      <textarea
        {...props}
        id={textareaId}
        rows={rows}
        required={required}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={description || undefined}
        className={`form-control resize-y ${className}`}
      />
    </FormField>
  );
}
