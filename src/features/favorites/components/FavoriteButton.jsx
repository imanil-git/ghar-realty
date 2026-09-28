import { Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useSession } from "../../auth/hooks/useSession";
import { useFavorites, useToggleFavorite } from "../hooks/useFavorites";

export default function FavoriteButton({ propertyId }) {
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
        className="flex size-11 items-center justify-center rounded-full bg-background/95 text-text disabled:opacity-50"
      >
        <Heart size={21} fill={saved ? "currentColor" : "none"} />
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
