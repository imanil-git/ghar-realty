import FormSection from "./FormSection";
import { FormInput, FormSelect } from "./FormControls";
import { provinces } from "../../../utils/constants";

export default function LocationSection() {
  return (
    <FormSection
      id="location"
      number="02"
      title="Property location"
      description="Use the property's actual address. All location fields are required to publish."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormSelect
          name="location.province"
          label="Province"
          required
          options={provinces}
        >
          <option value="">Choose a province</option>
        </FormSelect>
        <FormInput
          name="location.district"
          label="District"
          required
          placeholder="e.g. Lalitpur"
        />
        <FormInput
          name="location.city"
          label="Municipality / city"
          required
          placeholder="e.g. Lalitpur Metropolitan City"
        />
        <FormInput
          name="location.area"
          label="Area / neighborhood"
          required
          placeholder="e.g. Jhamsikhel"
        />
      </div>
      <FormInput
        name="location.mapUrl"
        label="Google Maps link"
        type="url"
        placeholder="https://maps.google.com/…"
        hint="Optional. Open Google Maps, find the property, then paste its share link here."
      />
      <a
        href="https://maps.google.com"
        target="_blank"
        rel="noreferrer"
        className="w-fit py-2 text-sm underline"
      >
        Open Google Maps ↗
      </a>
    </FormSection>
  );
}
