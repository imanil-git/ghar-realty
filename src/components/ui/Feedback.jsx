export default function Feedback({ error, message }) {
  if (error)
    return (
      <p
        role="alert"
        className="rounded-sm border border-error bg-error-surface p-4 text-sm text-error"
      >
        {error.message || error}
      </p>
    );
  if (message)
    return (
      <p
        role="status"
        className="border-l-2 border-text bg-surface p-4 text-sm"
      >
        {message}
      </p>
    );
  return null;
}
