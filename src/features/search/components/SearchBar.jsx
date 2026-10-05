import { useNavigate } from "react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function SearchBar({
  listingType: selectedType,
  onListingTypeChange,
  filters = {},
}) {
  const [localType, setLocalType] = useState("buy");
  const listingType = selectedType ?? localType;
  const navigate = useNavigate();
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams({ listingType, page: "1" });
    const location = data.get("location").trim();
    if (location) params.set("location", location);
    for (const [key, value] of Object.entries(filters))
      if (value !== "" && value != null) params.set(key, value);
    navigate(`/properties?${params}`);
  }
  return (
    <form onSubmit={submit} className="w-full max-w-[464px]">
      <fieldset className="mb-6 flex gap-1">
        <legend className="sr-only">Listing purpose</legend>
        {["buy", "rent"].map((value) => (
          <label
            key={value}
            className={`flex min-h-11 w-24 cursor-pointer items-center justify-center rounded-sm border border-border text-sm capitalize ${listingType === value ? "bg-action text-on-action" : "bg-background"}`}
          >
            <input
              type="radio"
              name="purpose"
              value={value}
              checked={listingType === value}
              onChange={() => {
                setLocalType(value);
                onListingTypeChange?.(value);
              }}
              className="peer sr-only"
            />
            <span className="peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4">
              {value}
            </span>
          </label>
        ))}
      </fieldset>
      <div className="flex items-stretch">
        <div className="flex min-w-0 flex-1 items-center border border-border">
          <span className="ml-4 shrink-0">
            <img
              src="/images/home/search.svg"
              alt=""
              className="home-design-icon"
            />
          </span>
          <input
            aria-label="City or neighborhood"
            name="location"
            placeholder="City, area or neighborhood"
            className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm outline-none focus:ring-0"
          />
        </div>
        <Button
          type="submit"
          aria-label="Search properties"
          className="w-14 shrink-0 !px-0"
        >
          <ArrowRight size={18} aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
