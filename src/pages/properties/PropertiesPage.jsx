import { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import { SlidersHorizontal } from "lucide-react";
import Container from "../../components/layout/Container";
import QueryState from "../../components/ui/QueryState";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import FilterForm from "../../features/search/components/FilterForm";
import PropertyMap from "../../features/search/components/PropertyMap";
import ResultsPagination from "../../features/search/components/ResultsPagination";
import { readFilters, filterParams } from "../../features/search/utils/filters";
import { useProperties } from "../../features/properties/hooks/useProperties";
import PropertyCard from "../../features/properties/components/PropertyCard";
import { categories, categoryLabel } from "../../utils/constants";
import GoogleMap from "../../features/search/components/GoogleMap";

export default function PropertiesPage() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("grid");
  const filters = { ...readFilters(params, category), pageSize: 4 };
  if (!filters.listingType) filters.listingType = "rent";
  const query = useProperties(filters);
  const title = category
    ? `${categoryLabel(category)} properties`
    : "Find your next place.";
  function apply(values) {
    setParams(filterParams({ ...values, page: 1 }));
    setOpen(false);
  }
  function clear() {
    setParams({ listingType: filters.listingType });
    setOpen(false);
  }
  if (category && !categories.includes(category))
    return (
      <Container className="py-16">
        <EmptyState title="Unknown property category">
          <Link to="/properties" className="underline">
            Browse all properties
          </Link>
        </EmptyState>
      </Container>
    );
  return (
    <Container className="py-10 sm:py-14">
      <title>{title} | Ghar Realty</title>
      <div className="grid items-end gap-6 lg:grid-cols-[1fr_440px]">
        <h1 className="text-3xl font-bold uppercase tracking-tight sm:text-5xl">
          {title}
        </h1>
        <form
          key={filters.location}
          onSubmit={(event) => {
            event.preventDefault();
            apply({
              ...filters,
              location: new FormData(event.currentTarget)
                .get("location")
                .trim(),
            });
          }}
        >
          <label className="block text-sm">
            <span className="mb-2 block">Location</span>
            <input
              name="location"
              defaultValue={filters.location}
              placeholder="Kathmandu Valley"
              className="w-full rounded-sm border border-border bg-background px-3 py-2.5"
              onBlur={(event) => {
                if (event.target.value.trim() !== filters.location)
                  apply({ ...filters, location: event.target.value.trim() });
              }}
            />
          </label>
        </form>
      </div>
      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[256px_minmax(0,1fr)]">
        <aside aria-label="Property filters" className="hidden lg:block">
          <FilterForm
            key={params.toString() + category}
            filters={filters}
            onApply={apply}
            onClear={clear}
            categoryLocked={!!category}
            autoApply
          />
        </aside>
        <section className="min-w-0" aria-label="Search results">
          {/* <PropertyMap properties={query.data?.items} /> */}
          <GoogleMap properties={query.data?.items} />
          <div className="my-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p role="status">
              {query.isPending
                ? "Finding properties…"
                : query.isError
                  ? "Unable to load properties"
                  : `${query.data?.total || 0} properties${filters.location ? ` in ${filters.location}` : ""}`}
            </p>
            <div className="flex items-center gap-4 text-muted">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex min-h-11 items-center gap-2 lg:hidden"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <div
                className="flex items-center gap-2"
                aria-label="Results view"
              >
                <button
                  type="button"
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                  className="min-h-11 aria-pressed:text-text"
                >
                  Grid
                </button>
                <span aria-hidden="true">/</span>
                <button
                  type="button"
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                  className="min-h-11 aria-pressed:text-text"
                >
                  List
                </button>
              </div>
              <span aria-hidden="true">·</span>
              <label>
                <span className="sr-only">Sort by</span>
                <select
                  value={filters.sort}
                  onChange={(event) =>
                    apply({ ...filters, sort: event.target.value })
                  }
                  className="min-h-11 max-w-40 bg-background text-sm"
                >
                  <option value="latest">Newest first ↓</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </label>
            </div>
          </div>
          <QueryState query={query}>
            {(data) => (
              <>
                {data.items.length ? (
                  <div
                    className={`grid gap-x-6 gap-y-7 ${view === "grid" ? "sm:grid-cols-2" : ""}`}
                  >
                    {data.items.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        variant={
                          view === "grid" ? "editorial" : "editorial-list"
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No properties found">
                    <p>Try a different location or a wider budget.</p>
                    <Button
                      variant="secondary"
                      className="mt-5"
                      onClick={clear}
                    >
                      Reset filters
                    </Button>
                  </EmptyState>
                )}
                <ResultsPagination
                  page={filters.page}
                  pages={data.pages}
                  onChange={(page) =>
                    setParams(filterParams({ ...filters, page }))
                  }
                />
              </>
            )}
          </QueryState>
        </section>
      </div>
      <Modal
        title="Filter properties"
        open={open}
        onClose={() => setOpen(false)}
      >
        {open && (
          <FilterForm
            key={params.toString() + category}
            filters={filters}
            onApply={apply}
            onClear={clear}
            categoryLocked={!!category}
          />
        )}
      </Modal>
    </Container>
  );
}
