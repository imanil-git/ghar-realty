import { Link } from "react-router";
import { ArrowRight, Building2, House, LandPlot, Store } from "lucide-react";
import Container from "../../components/layout/Container";
import QueryState from "../../components/ui/QueryState";
import EmptyState from "../../components/ui/EmptyState";
import SearchBar from "../../features/search/components/SearchBar";
import PropertyCard from "../../features/properties/components/PropertyCard";
import {
  useFeaturedProperties,
  useRecentProperties,
  useCategories,
} from "../../features/properties/hooks/useProperties";
import { categories, categoryLabel } from "../../utils/constants";

function PropertySection({ title, caption, query, to }) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-muted">
            {caption}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
        </div>
        <Link to={to} className="flex shrink-0 items-center gap-2 py-3 text-sm">
          View all <ArrowRight size={17} />
        </Link>
      </div>
      <QueryState query={query}>
        {(items) =>
          items.length ? (
            <div className="grid auto-cols-[85%] grid-flow-col gap-6 overflow-x-auto pb-3 snap-x snap-mandatory sm:auto-cols-[46%] xl:auto-cols-[calc((100%-72px)/4)]">
              {items.map((p) => (
                <div key={p.id} className="snap-start">
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="New homes are on their way" />
          )
        }
      </QueryState>
    </section>
  );
}

export default function HomePage() {
  const featured = useFeaturedProperties();
  const recent = useRecentProperties();
  const counts = useCategories();
  return (
    <>
      <title>Ghar Realty — Find your place</title>
      <Container>
        <section className="pb-10 pt-12 sm:pt-16">
          <div className="mb-9 grid items-end gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.2em] text-muted">
                Your next chapter starts here
              </p>
              <h1 className="text-[clamp(2.7rem,6vw,5.75rem)] font-bold leading-[1.02] tracking-[-0.045em]">
                FIND YOUR
                <br />
                PERFECT HOME.
              </h1>
            </div>
            <div>
              <p className="mb-6 max-w-sm text-sm leading-6 text-muted">
                Thoughtful spaces. Familiar neighborhoods. Discover a place to
                call your own, right here in Nepal.
              </p>
              <SearchBar />
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[2.25/1]">
            <img
              src="/images/hero.jpg"
              alt="Modern architectural home surrounded by trees"
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
            <span className="absolute bottom-4 left-4 bg-white/95 px-4 py-2 text-xs text-[#1e1e1b]">
              Spaces worth coming home to.
            </span>
          </div>
          <div className="mt-5 flex flex-wrap justify-between gap-3 text-xs text-muted">
            <span>Rooted in Nepal. Open to possibilities.</span>
            <span>Kathmandu / Lalitpur / Bhaktapur / Pokhara</span>
          </div>
        </section>
        <section className="border-y border-border py-10">
          <div className="mb-6 flex flex-wrap justify-between gap-3">
            <h2 className="text-2xl font-semibold">A space for every plan</h2>
            <p className="text-sm text-muted">Explore by property type</p>
          </div>
          <QueryState query={counts}>
            {(data) => (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {categories.map((category) => {
                  const Icon =
                    category === "land"
                      ? LandPlot
                      : ["office", "shop"].includes(category)
                        ? Store
                        : category === "house" || category === "villa"
                          ? House
                          : Building2;
                  return (
                    <Link
                      key={category}
                      to={`/categories/${category}`}
                      className="border border-border p-5 hover:bg-surface"
                    >
                      <Icon size={25} strokeWidth={1.3} />
                      <h3 className="mt-6 text-sm">
                        {categoryLabel(category)}
                      </h3>
                      <p className="mt-2 text-xs text-muted">
                        {data[category] || 0} properties
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </QueryState>
        </section>
        <PropertySection
          title="Worth a closer look"
          caption="Selected spaces"
          query={featured}
          to="/properties"
        />
        <section className="flex flex-col justify-between gap-6 bg-surface p-7 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold">A comfortable fit.</h2>
            <p className="mt-2 text-sm text-muted">
              Rentals with room for your budget.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["Under 50K", 0, 50000],
              ["50K–1 Lakh", 50000, 100000],
              ["1–3 Lakh", 100000, 300000],
              ["3–5 Lakh", 300000, 500000],
            ].map(([label, min, max]) => (
              <Link
                key={label}
                to={`/properties?listingType=rent&minPrice=${min}&maxPrice=${max}`}
                className="border border-control-border px-4 py-3 text-xs hover:bg-background"
              >
                NPR {label}
              </Link>
            ))}
            <Link
              to="/properties?listingType=rent"
              className="px-4 py-3 text-xs underline"
            >
              Custom range →
            </Link>
          </div>
        </section>
        <PropertySection
          title="New in your neighborhood"
          caption="Recently added"
          query={recent}
          to="/properties?sort=latest"
        />
        <section className="mb-16 grid border border-border md:grid-cols-2">
          <img
            src="/images/living.jpg"
            alt="Light-filled living room"
            loading="lazy"
            className="h-64 w-full object-cover md:h-full"
          />
          <div className="p-8 sm:p-12">
            <p className="text-xs uppercase tracking-widest text-muted">
              For property owners
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight">
              Your space.
              <br />
              Their new beginning.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted">
              Bring your property to people looking for a place just like yours.
            </p>
            <Link
              to="/account/properties/new"
              className="mt-7 inline-flex min-h-12 items-center gap-4 bg-action px-5 text-sm text-on-action"
            >
              List a property <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}
