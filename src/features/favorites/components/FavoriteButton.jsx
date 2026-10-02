import { Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useSession } from "../../auth/hooks/useSession";
import { useFavorites, useToggleFavorite } from "../hooks/useFavorites";

export default function FavoriteButton({ propertyId, showLabel = false }) {
  const session = useSession();
  const favorites = useFavorites(session.data?.id);
  const mutation = useToggleFavorite();
  const navigate = useNavigate();
  const location = useLocation();
  const saved = favorites.data?.some((p) => p.id === propertyId) || false;
  function toggle() {
    if (!session.data) {
      navigate(
        `/login?next=${encodeURIComponent(location.pathname + location.search)}`,
      );
      return;
    }
    mutation.mutate({ id: propertyId, saved });
  }
  return (
    <div className="shrink-0">
      <button
        type="button"
        onClick={toggle}
        disabled={mutation.isPending || session.isPending}
        aria-label={saved ? "Remove from saved homes" : "Save property"}
        aria-pressed={saved}
        className={
          showLabel
            ? "flex min-h-12 items-center justify-center gap-2 rounded-sm border border-border bg-background px-5 text-sm text-text disabled:opacity-50"
            : "flex size-11 items-center justify-center rounded-full bg-background/95 text-text disabled:opacity-50"
        }
      >
        <Heart
          size={showLabel ? 16 : 21}
          fill={saved ? "currentColor" : "none"}
        />
        {showLabel && (saved ? "Saved" : "Save")}
      </button>
      {mutation.isError && (
        <p
          role="alert"
          className="max-w-44 bg-background p-2 text-xs text-error"
        >
          {mutation.error.message}
        </p>
      )}
    </div>
  );
}
