import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Upload, ArrowLeft, ArrowRight, X } from "lucide-react";
import Button from "../../../components/ui/Button";
import { uploadImage } from "../../../services/uploadService";
import FormSection from "./FormSection";
import { FormInput } from "./FormControls";

export default function MediaSection({ onBusyChange }) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const images = watch("images");
  const inputRef = useRef(null);
  const busyRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState([]);
  const [message, setMessage] = useState("");
  function update(next) {
    setValue("images", next, { shouldDirty: true, shouldValidate: true });
  }
  async function upload(files) {
    if (busyRef.current) return;
    const selected = Array.from(files);
    if (selected.length + images.length > 12) {
      setMessage("You can add up to 12 photos.");
      return;
    }
    busyRef.current = true;
    setBusy(true);
    onBusyChange(true);
    setFailed([]);
    setMessage("");
    const next = [...images];
    const failures = [];
    for (const file of selected) {
      try {
        const result = await uploadImage(file);
        next.push(result.url);
      } catch (error) {
        failures.push({ file, message: error.message });
      }
    }
    update(next);
    setFailed(failures);
    setBusy(false);
    busyRef.current = false;
    onBusyChange(false);
  }
  function move(index, direction) {
    const next = [...images];
    const target = index + direction;
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  }
  return (
    <FormSection
      id="media"
      number="03"
      title="Photos & video"
      description="Put your strongest photo first. It becomes the cover of your listing."
    >
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(e.dataTransfer.files);
        }}
        className="border border-dashed border-control-border bg-surface p-8 text-center"
      >
        <Upload className="mx-auto mb-4" size={28} strokeWidth={1.3} />
        <p className="mb-4 text-sm">
          Drag photos here, or choose them from your device.
        </p>
        <Button
          variant="secondary"
          disabled={busy}
          aria-invalid={errors.images ? true : undefined}
          onClick={() => inputRef.current.click()}
        >
          {busy ? "Processing photos…" : "Choose photos"}
        </Button>
        <input
          ref={inputRef}
          aria-label="Property photos"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/bmp,image/webp"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            upload(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="mt-4 text-xs leading-5 text-muted">
          JPG, PNG, GIF, BMP, WebP · Up to 20 MB each
          <br />
          Minimum 600 × 400 pixels · Maximum 12 photos
        </p>
      </div>
      {busy && (
        <p role="status" className="text-sm">
          Preparing images…
        </p>
      )}
      {(message || errors.images) && (
        <p role="alert" className="text-sm text-error">
          {message || errors.images.message}
        </p>
      )}
      {failed.map(({ file, message }, i) => (
        <div key={i} className="border border-error p-3">
          <p role="alert" className="text-sm text-error">
            {file.name}: {message}
          </p>
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => upload([file])}
          >
            Retry photo
          </Button>
        </div>
      ))}
      {!images.length && (
        <p className="text-sm text-muted">No photos added yet.</p>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((src, index) => (
          <div
            key={src.slice(-30) + index}
            className="min-w-0 border border-border"
          >
            <img
              src={src}
              alt={`Listing photo ${index + 1}`}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="p-2">
              <button
                type="button"
                disabled={busy || index === 0}
                onClick={() =>
                  update([src, ...images.filter((_, i) => i !== index)])
                }
                className="min-h-10 text-xs disabled:font-semibold"
              >
                {index === 0 ? "Cover photo" : "Make cover"}
              </button>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  aria-label={`Move photo ${index + 1} left`}
                  disabled={busy || index === 0}
                  onClick={() => move(index, -1)}
                  className="p-2 disabled:opacity-30"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  aria-label={`Move photo ${index + 1} right`}
                  disabled={busy || index === images.length - 1}
                  onClick={() => move(index, 1)}
                  className="p-2 disabled:opacity-30"
                >
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  aria-label={`Remove photo ${index + 1}`}
                  disabled={busy}
                  onClick={() => update(images.filter((_, i) => i !== index))}
                  className="p-2"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <FormInput
        name="videoUrl"
        label="Video tour link"
        type="url"
        placeholder="https://…"
        hint="Optional. Link to a hosted video tour."
      />
    </FormSection>
  );
}
