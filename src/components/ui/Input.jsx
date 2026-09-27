import { useId } from 'react'
import FormField from './FormField'

export default function Input({ label, hint, error, id, required, className = '', ...props }) {
  const generatedId = useId()
  const inputId = id || generatedId
  const description = [props['aria-describedby'], hint && `${inputId}-hint`, error && `${inputId}-error`].filter(Boolean).join(' ')

  return (
    <FormField id={inputId} label={label} hint={hint} error={error} required={required}>
      <input
        {...props}
        id={inputId}
        required={required}
        aria-invalid={error ? true : props['aria-invalid']}
        aria-describedby={description || undefined}
        className={`form-control ${className}`}
      />
    </FormField>
  )
}
