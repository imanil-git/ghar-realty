import { useNavigate } from "react-router";
import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [listingType, setListingType] = useState("buy");
  const navigate = useNavigate();
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams({
      listingType,
      location: data.get("location").trim(),
      page: "1",
    });
    navigate(`/properties?${params}`);
  }
  return (
    <form onSubmit={submit} className="w-full">
      <fieldset className="mb-3 flex gap-6">
        <legend className="sr-only">Listing purpose</legend>
        {["buy", "rent"].map((value) => (
          <label
            key={value}
            className={`cursor-pointer border-b-2 pb-2 text-sm capitalize ${listingType === value ? "border-text" : "border-transparent text-muted"}`}
          >
            <input
              type="radio"
              name="purpose"
              value={value}
              checked={listingType === value}
              onChange={() => setListingType(value)}
              className="sr-only peer"
            />
            <span className="peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4">
              {value}
            </span>
          </label>
        ))}
      </fieldset>
      <div className="flex min-h-14 items-center border border-control-border">
        <Search size={19} className="ml-4 shrink-0" aria-hidden="true" />
        <input
          aria-label="City or neighborhood"
          name="location"
          placeholder="Enter a city or neighborhood"
          className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm outline-offset-0"
        />
        <button
          aria-label="Search properties"
          className="flex size-14 shrink-0 items-center justify-center bg-action text-on-action"
        >
          <ArrowRight size={22} />
        </button>
      </div>
    </form>
  );
}
