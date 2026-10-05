import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Container from "../../components/layout/Container";
import QueryState from "../../components/ui/QueryState";
import EmptyState from "../../components/ui/EmptyState";
import Select from "../../components/ui/Select";
import SearchBar from "../../features/search/components/SearchBar";
import PropertyCard from "../../features/properties/components/PropertyCard";
import {
  useFeaturedProperties,
  useRecentProperties,
  useCategories,
} from "../../features/properties/hooks/useProperties";
import { detailPresentation } from "../../features/properties/utils/detailPresentation";
import { categories, categoryLabel } from "../../utils/constants";
import "../../styles/property-detail.css";
import "../../styles/home.css";

const budgets = [
  ["Under NPR 50K", 0, 50000],
  ["NPR 50K–1 Lakh", 50000, 100000],
  ["NPR 1–3 Lakh", 100000, 300000],
  ["NPR 3–5 Lakh", 300000, 500000],
];
const categoryIcons = {
  house: "home",
  apartment: "building",
  land: "land",
  flat: "building",
  villa: "home",
  office: "office",
  shop: "shop",
};

function SectionHeading({ title, caption, to }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-xs uppercase leading-[18px] text-muted">
          {caption}
        </p>
        <h2 className="text-[28px] font-semibold leading-tight sm:text-[32px] sm:leading-10">
          {title}
        </h2>
      </div>
      {to && (
        <Link to={to} className="py-2 text-sm hover:underline">
          View all properties →
        </Link>
      )}
    </div>
  );
}
function PropertySection({ title, caption, query, to }) {
  return (
    <section className="grid gap-8 lg:gap-12">
      <SectionHeading title={title} caption={caption} to={to} />
      <QueryState query={query}>
        {(items) =>
          items.length ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.slice(0, 3).map((p) => (
                <PropertyCard
                  key={p.id}
                  property={detailPresentation(p)}
                  variant="home"
                  imageClassName="aspect-[416/264]"
                />
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
  const navigate = useNavigate();
  const [listingType, setListingType] = useState("buy");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const range = budget === "" ? null : budgets[Number(budget)];
  const filters = {
    category,
    ...(range ? { minPrice: range[1], maxPrice: range[2] } : {}),
  };
  function quickSearch(key, value) {
    const params = new URLSearchParams({ listingType, page: "1" });
    for (const [name, current] of Object.entries({ ...filters, [key]: value }))
      if (current !== "") params.set(name, current);
    navigate(`/properties?${params}`);
  }
  return (
    <>
      <title>Ghar Realty — Find your perfect home</title>
      <Container className="home-page property-detail grid grid-cols-1 gap-12 pb-16 pt-12">
        <section className="grid min-w-0 grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,780fr)_minmax(0,484fr)] lg:gap-12">
          <h1 className="text-[clamp(2rem,6.12vw,5.5rem)] font-bold leading-[1.045] tracking-normal">
            FIND YOUR
            <br />
            PERFECT HOME.
          </h1>
          <div>
            <p className="mb-6 text-base leading-6 text-muted">
              A first home. A fresh start. A little more room.
              <br />
              Discover places to buy and rent across Nepal.
            </p>
            <SearchBar
              listingType={listingType}
              onListingTypeChange={setListingType}
              filters={filters}
            />
          </div>
        </section>
        <img
          src="/images/hero.jpg"
          alt="Modern white home beside a swimming pool under a blue sky"
          fetchPriority="high"
          className="aspect-[4/3] w-full object-cover sm:aspect-[1312/560]"
        />
        <section
          aria-label="Quick property filters"
          className="grid gap-6 sm:grid-cols-3"
        >
          <Select
            label="Property category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All property types</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </Select>
          <Select
            label="Your budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="">Any price</option>
            {budgets.map(([label], index) => (
              <option key={label} value={index}>
                {label}
              </option>
            ))}
          </Select>
          <Select
            label="Popular locations"
            value=""
            onChange={(e) => quickSearch("location", e.target.value)}
          >
            <option value="" disabled>
              Kathmandu · Lalitpur · Pokhara
            </option>
            {["Kathmandu", "Lalitpur", "Pokhara"].map((city) => (
              <option key={city}>{city}</option>
            ))}
          </Select>
        </section>
        <section className="grid gap-8 lg:gap-12">
          <SectionHeading
            caption="Explore categories"
            title="A space for every plan."
          />
          <QueryState query={counts}>
            {(data) => (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                {categories.map((c) => (
                  <Link
                    key={c}
                    to={`/categories/${c}`}
                    className="flex flex-col gap-4 border border-border p-5 hover:bg-surface xl:p-6"
                  >
                    <span className="flex h-7 items-center">
                      <img
                        src={`/images/home/${categoryIcons[c]}.svg`}
                        alt=""
                        className="home-design-icon"
                      />
                    </span>
                    <h3 className="text-sm font-medium leading-5">
                      {c === "flat" ? "Flats" : categoryLabel(c)}
                    </h3>
                    <p className="text-xs leading-[18px] text-muted">
                      {data[c] || 0} {data[c] === 1 ? "property" : "properties"}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </QueryState>
        </section>
        <PropertySection
          title="Worth a closer look."
          caption="Featured properties"
          query={featured}
          to="/properties"
        />
        <section className="bg-surface p-6 sm:p-8">
          <h2 className="text-[28px] font-semibold leading-tight sm:text-[32px] sm:leading-10">
            Your budget. More possibilities.
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {budgets.map(([label, min, max]) => (
              <Link
                key={label}
                to={`/properties?listingType=rent&minPrice=${min}&maxPrice=${max}`}
                className="flex min-h-12 items-center justify-center rounded-sm border border-border bg-background px-3 py-3 text-center text-sm hover:underline"
              >
                {label}
              </Link>
            ))}
            <Link
              to="/properties?listingType=rent"
              className="flex min-h-12 items-center justify-center rounded-sm border border-border bg-background px-3 py-3 text-sm hover:underline"
            >
              Custom range →
            </Link>
          </div>
        </section>
        <PropertySection
          title="New in your neighborhood."
          caption="Just listed"
          query={recent}
          to="/properties?sort=latest"
        />
        <section className="flex flex-col justify-between gap-8 bg-surface p-6 sm:p-10 lg:flex-row lg:items-start">
          <div>
            <h2 className="text-[28px] font-semibold leading-tight sm:text-[32px] sm:leading-10">
              YOUR PROPERTY. THEIR NEXT CHAPTER.
            </h2>
            <p className="mt-4 text-base leading-6 text-muted">
              Connect your space with people looking for a place like yours.
            </p>
          </div>
          <Link
            to="/account/properties/new"
            className="inline-flex min-h-12 shrink-0 items-center justify-center self-start rounded-sm bg-action px-8 text-sm text-on-action"
          >
            List your property →
          </Link>
        </section>
      </Container>
    </>
  );
}
