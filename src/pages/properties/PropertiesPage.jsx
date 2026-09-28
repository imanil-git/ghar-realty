import { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import { SlidersHorizontal } from "lucide-react";
import Container from "../../components/layout/Container";
import PageHeading from "../../components/layout/PageHeading";
import QueryState from "../../components/ui/QueryState";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import Select from "../../components/ui/Select";
import FilterForm from "../../features/search/components/FilterForm";
import { readFilters, filterParams } from "../../features/search/utils/filters";
import { useProperties } from "../../features/properties/hooks/useProperties";
import PropertyCard from "../../features/properties/components/PropertyCard";
import { categories, categoryLabel } from "../../utils/constants";

export default function PropertiesPage() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const filters = readFilters(params, category);
  const query = useProperties(filters);
  const title = category
    ? `${categoryLabel(category)} properties`
    : "Find your next place.";
  function apply(values) {
    setParams(filterParams({ ...values, page: 1 }));
    setOpen(false);
  }
  function clear() {
    setParams({});
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
      <PageHeading
        title={title}
        eyebrow="Explore / Nepal"
        description="Considered spaces for the way you want to live."
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden self-start border-r border-border pr-7 lg:block">
          <h2 className="mb-6 text-lg font-semibold">Refine your search</h2>
          <FilterForm
            key={params.toString() + category}
            filters={filters}
            onApply={apply}
            onClear={clear}
            categoryLocked={!!category}
          />
        </aside>
        <section className="min-w-0" aria-label="Search results">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p role="status" className="text-sm text-muted">
                {query.isPending
                  ? "Finding properties…"
                  : `${query.data?.total || 0} properties`}
              </p>
              <Button
                variant="secondary"
                className="mt-3 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <SlidersHorizontal size={16} />
                Filters
              </Button>
            </div>
            <div className="w-44">
              <Select
                label="Sort by"
                value={filters.sort}
                onChange={(e) => apply({ ...filters, sort: e.target.value })}
              >
                <option value="latest">Latest first</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </Select>
            </div>
          </div>
          <QueryState query={query}>
            {(data) => (
              <>
                {data.items.length ? (
                  <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-2">
                    {data.items.map((p) => (
                      <PropertyCard key={p.id} property={p} />
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
                      Clear filters
                    </Button>
                  </EmptyState>
                )}
                <Pagination
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
