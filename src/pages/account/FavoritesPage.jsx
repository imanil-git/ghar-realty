import { Link } from "react-router";
import { useSession } from "../../features/auth/hooks/useSession";
import { useFavorites } from "../../features/favorites/hooks/useFavorites";
import QueryState from "../../components/ui/QueryState";
import EmptyState from "../../components/ui/EmptyState";
import PropertyCard from "../../features/properties/components/PropertyCard";

export default function FavoritesPage() {
  const session = useSession();
  const favorites = useFavorites(session.data?.id);
  return (
    <section>
      <title>Saved homes | Ghar Realty</title>
      <p className="mb-8 text-sm text-muted">
        The places you can picture calling home.
      </p>
      <QueryState query={favorites}>
        {(items) =>
          items.length ? (
            <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  variant="editorial"
                  imageClassName="aspect-[416/264]"
                />
              ))}
            </div>
          ) : (
            <EmptyState title="Keep your favorites close">
              <p>Tap a heart to save a home here.</p>
              <Link to="/properties" className="mt-4 inline-block underline">
                Explore properties →
              </Link>
            </EmptyState>
          )
        }
      </QueryState>
    </section>
  );
}
