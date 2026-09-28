import { useFormContext } from "react-hook-form";
import FormSection from "./FormSection";
import { FormInput, FormSelect } from "./FormControls";
import { categories, categoryLabel } from "../../../utils/constants";

export default function OverviewSection() {
  const { watch, setValue } = useFormContext();
  const land = watch("category") === "land";
  return (
    <FormSection
      id="overview"
      number="01"
      title="Property overview"
      description="Start with the basics. You can save an unfinished listing as a draft."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormSelect name="listingType" label="Listing purpose">
          <option value="buy">For sale</option>
          <option value="rent">For rent</option>
        </FormSelect>
        <FormSelect
          name="category"
          label="Property category"
          onValueChange={() =>
            setValue("propertyType", "standard", { shouldDirty: true })
          }
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c)}
            </option>
          ))}
        </FormSelect>
        <FormSelect
          name="propertyType"
          label={land ? "Land type" : "Property type"}
          options={
            land
              ? ["standard", "residential", "agricultural", "commercial"]
              : [
                  "standard",
                  "1bhk",
                  "2bhk",
                  "3bhk",
                  "4bhk",
                  "5bhk",
                  "studio",
                  "duplex",
                  "penthouse",
                ]
          }
        />
        <FormSelect
          name="ownership"
          label="Ownership"
          options={["Individual", "Institutional"]}
        />
      </div>
      {!land && (
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput
            name="buildYear"
            label="Build year"
            placeholder="YYYY"
            inputMode="numeric"
          />
          <FormSelect name="calendar" label="Calendar" options={["BS", "AD"]} />
        </div>
      )}
    </FormSection>
  );
}
