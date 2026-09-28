import { useState } from "react";
import { House } from "lucide-react";

export default function PropertyImage({
  src,
  alt,
  className = "",
  eager = false,
}) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      loading={eager ? "eager" : "lazy"}
      className={`h-full w-full object-cover ${className}`}
    />
  ) : (
    <div
      className={`flex h-full min-h-40 w-full flex-col items-center justify-center gap-3 bg-surface text-muted ${className}`}
    >
      <House size={36} aria-hidden="true" />
      <span className="text-xs">Photography coming soon</span>
    </div>
  );
}
