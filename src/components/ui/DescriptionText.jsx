function inlineText(text) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });
}

// Only the formatting offered by the editor is supported. React escapes all text.
export default function DescriptionText({ text }) {
  const blocks = text.split(/\n\s*\n/);
  return (
    <div className="mt-4 space-y-4 text-sm leading-7 text-muted">
      {blocks.map((block, index) => {
        const lines = block.split("\n");
        if (lines.every((line) => /^[-*] /.test(line)))
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {lines.map((line, i) => (
                <li key={i}>{inlineText(line.slice(2))}</li>
              ))}
            </ul>
          );
        return (
          <p key={index} className="whitespace-pre-wrap">
            {inlineText(block)}
          </p>
        );
      })}
    </div>
  );
}
