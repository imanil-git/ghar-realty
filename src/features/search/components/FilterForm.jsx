import { useRef, useState } from "react";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import { categoryLabel } from "../../../utils/constants";

const categoryOptions = [
  "house",
  "apartment",
  "flat",
  "land",
  "office",
  "shop",
  "villa",
];
const rangeText = (min, max) =>
  min === "" && max === "" ? "" : `${min || 0} — ${max === "" ? "" : max}`;

function RangeField({ label, min, max, onCommit, placeholder }) {
  const [text, setText] = useState(rangeText(min, max));
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  function commit() {
    const parts = text
      .replaceAll(",", "")
      .trim()
      .split(/\s*[—–-]\s*/);
    const low = parts[0] === "" ? "" : Number(parts[0]);
    const high = !parts[1] ? "" : Number(parts[1]);
    if (
      /^[—–-]/.test(text.trim()) ||
      parts.length > 2 ||
      ![low, high].every((n) => n === "" || (Number.isFinite(n) && n >= 0)) ||
      (high !== "" && low > high)
    ) {
      inputRef.current.setCustomValidity(
        "Enter a valid minimum — maximum range.",
      );
      setError("Enter a valid minimum — maximum range.");
      return;
    }
    inputRef.current.setCustomValidity("");
    setError("");
    onCommit(low, high);
  }
  return (
    <label className="block text-sm">
      <span className="mb-2 block">{label}</span>
      <input
        ref={inputRef}
        className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm"
        value={text}
        placeholder={placeholder}
        aria-invalid={!!error}
        onChange={(event) => setText(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          }
        }}
      />
      {error && (
        <span role="alert" className="mt-2 block text-xs text-error">
          {error}
        </span>
      )}
    </label>
  );
}

export default function FilterForm({
  filters,
  onApply,
  onClear,
  categoryLocked,
  autoApply = false,
}) {
  const [values, setValues] = useState(filters);
  function update(patch) {
    if (
      Object.entries(patch).every(
        ([key, value]) => String(values[key]) === String(value),
      )
    )
      return;
    const next = { ...values, ...patch };
    setValues(next);
    if (autoApply) onApply(next);
  }
  const selected = values.category ? values.category.split(",") : [];
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onApply(values);
      }}
      className="space-y-7"
    >
      <div
        role="group"
        aria-label="Buy or rent"
        className="grid grid-cols-2 gap-2"
      >
        {["buy", "rent"].map((type) => (
          <button
            key={type}
            type="button"
            aria-pressed={values.listingType === type}
            onClick={() => update({ listingType: type })}
            className={`min-h-11 rounded-sm border px-3 text-sm ${values.listingType === type ? "border-action bg-action text-on-action" : "border-border bg-background"}`}
          >
            {type === "buy" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>
      <h2 className="text-xl font-semibold">Refine your search</h2>
      <RangeField
        label={
          values.listingType === "rent"
            ? "Monthly budget · NPR"
            : "Budget · NPR"
        }
        min={values.minPrice}
        max={values.maxPrice}
        placeholder="30,000 — 100,000"
        onCommit={(minPrice, maxPrice) => update({ minPrice, maxPrice })}
      />
      <fieldset>
        <legend className="mb-4 text-sm">Property category</legend>
        <div className="space-y-1.5">
          {categoryOptions.map((category) => (
            <label key={category} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-3.5 accent-action"
                checked={selected.includes(category)}
                disabled={categoryLocked}
                onChange={(event) =>
                  update({
                    category: (event.target.checked
                      ? [...selected, category]
                      : selected.filter((item) => item !== category)
                    ).join(","),
                  })
                }
              />
              {categoryLabel(category)}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-sm">Bedrooms</legend>
        <div className="grid grid-cols-4 gap-2">
          {[
            ["", "Any"],
            [1, "1"],
            [2, "2"],
            [3, "3+"],
          ].map(([value, label]) => (
            <button
              key={label}
              type="button"
              aria-pressed={String(values.bedrooms) === String(value)}
              onClick={() => update({ bedrooms: value })}
              className={`min-h-11 rounded-sm border text-sm ${String(values.bedrooms) === String(value) ? "border-action bg-action text-on-action" : "border-border"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      <Select
        label="Bathrooms"
        value={values.bathrooms}
        onChange={(event) => update({ bathrooms: event.target.value })}
        className="border-border py-2"
      >
        <option value="">Any</option>
        {[1, 2, 3, 4].map((n) => (
          <option key={n} value={n}>
            {n}+
          </option>
        ))}
      </Select>
      <Select
        label="Property type"
        value={values.propertyType}
        onChange={(event) => update({ propertyType: event.target.value })}
        className="border-border py-2"
      >
        <option value="">Any</option>
        {[
          "studio",
          "1bhk",
          "2bhk",
          "3bhk",
          "4bhk",
          "5bhk",
          "duplex",
          "penthouse",
          "standard",
        ].map((type) => (
          <option key={type} value={type}>
            {type.replace("bhk", " BHK")}
          </option>
        ))}
      </Select>
      <RangeField
        label="Area · sq. ft."
        min={values.minArea}
        max={values.maxArea}
        placeholder="800 — 2,000"
        onCommit={(minArea, maxArea) =>
          update({
            minArea,
            maxArea,
            areaUnit: minArea !== "" || maxArea !== "" ? "sqft" : "",
          })
        }
      />
      <fieldset aria-label="Amenities" className="space-y-2">
        {["parking", "furnished", "balcony"].map((name) => (
          <label key={name} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-3.5 accent-action"
              checked={!!values[name]}
              onChange={(event) => update({ [name]: event.target.checked })}
            />
            {name[0].toUpperCase() + name.slice(1)}
          </label>
        ))}
      </fieldset>
      {!autoApply && (
        <Button type="submit" className="w-full">
          Apply filters
        </Button>
      )}
      <Button
        variant="secondary"
        className="w-full border-border"
        onClick={onClear}
      >
        Reset filters
      </Button>
    </form>
  );
}
