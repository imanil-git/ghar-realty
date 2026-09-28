import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={onClose}
      className={`fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto border border-border bg-background p-6 text-text backdrop:bg-black/60 ${wide ? "max-w-4xl" : "max-w-lg"}`}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="flex size-11 shrink-0 items-center justify-center"
        >
          <X size={22} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
