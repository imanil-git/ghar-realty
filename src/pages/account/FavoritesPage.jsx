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
      <h1 className="mb-8 text-3xl font-semibold">Saved homes</h1>
      <QueryState query={favorites}>
        {(items) =>
          items.length ? (
            <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((p) => (
                <PropertyCard key={p.id} property={p} variant="compact" />
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
