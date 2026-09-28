import { useState } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import { categories, categoryLabel } from "../../../utils/constants";

export default function FilterForm({
  filters,
  onApply,
  onClear,
  categoryLocked,
}) {
  const [values, setValues] = useState(filters);
  const update = (event) =>
    setValues({ ...values, [event.target.name]: event.target.value });
  const [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    if (
      values.minPrice !== "" &&
      values.maxPrice !== "" &&
      Number(values.minPrice) > Number(values.maxPrice)
    ) {
      setError("Maximum price must be greater than minimum price.");
      return;
    }
    if (
      values.minArea !== "" &&
      Number(values.minArea) > 0 &&
      !values.areaUnit
    ) {
      setError("Choose an area unit when filtering by size.");
      return;
    }
    setError("");
    onApply(values);
  }
  return (
    <form onSubmit={submit} className="grid gap-5">
      <Select
        label="Buy or rent"
        name="listingType"
        value={values.listingType}
        onChange={update}
      >
        <option value="">Buy & rent</option>
        <option value="buy">Buy</option>
        <option value="rent">Rent</option>
      </Select>
      <Input
        label="City or neighborhood"
        name="location"
        value={values.location}
        onChange={update}
        placeholder="e.g. Kathmandu"
      />
      <Select
        label="Property category"
        name="category"
        value={values.category}
        onChange={update}
        disabled={categoryLocked}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {categoryLabel(c)}
          </option>
        ))}
      </Select>
      <Select
        label="Property type"
        name="propertyType"
        value={values.propertyType}
        onChange={update}
      >
        <option value="">All types</option>
        {[
          "1bhk",
          "2bhk",
          "3bhk",
          "4bhk",
          "5bhk",
          "studio",
          "duplex",
          "penthouse",
          "standard",
        ].map((type) => (
          <option key={type}>{type}</option>
        ))}
      </Select>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Min price (NPR)"
          type="number"
          min="0"
          name="minPrice"
          value={values.minPrice}
          onChange={update}
        />
        <Input
          label="Max price (NPR)"
          type="number"
          min="0"
          name="maxPrice"
          value={values.maxPrice}
          onChange={update}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Bedrooms"
          name="bedrooms"
          value={values.bedrooms}
          onChange={update}
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </Select>
        <Select
          label="Bathrooms"
          name="bathrooms"
          value={values.bathrooms}
          onChange={update}
        >
          <option value="">Any</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Minimum area"
          type="number"
          min="0"
          name="minArea"
          value={values.minArea}
          onChange={update}
        />
        <Select
          label="Area unit"
          name="areaUnit"
          value={values.areaUnit}
          onChange={update}
        >
          <option value="">Any</option>
          {["sqft", "sqm", "aana", "ropani", "kattha"].map((unit) => (
            <option key={unit}>{unit}</option>
          ))}
        </Select>
      </div>
      <Button type="submit">Apply filters</Button>
      <Button variant="ghost" onClick={onClear}>
        Clear filters
      </Button>
    </form>
  );
}
