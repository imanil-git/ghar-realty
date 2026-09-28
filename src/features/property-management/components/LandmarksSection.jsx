import { useFieldArray, useFormContext } from "react-hook-form";
import FormSection from "./FormSection";
import { FormInput, FormSelect } from "./FormControls";
import Button from "../../../components/ui/Button";
import { landmarkCategories } from "../../../utils/constants";

export default function LandmarksSection() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "landmarks",
  });
  return (
    <FormSection
      id="landmarks"
      number="07"
      title="Nearby landmarks"
      description="Help people understand the neighborhood. Distances are approximate."
    >
      {!fields.length && (
        <p className="border border-dashed border-border p-5 text-sm text-muted">
          No landmarks added.
        </p>
      )}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid gap-4 border border-border p-4 sm:grid-cols-2"
        >
          <FormSelect
            name={`landmarks.${index}.category`}
            label="Landmark category"
            options={landmarkCategories}
          />
          <FormInput name={`landmarks.${index}.name`} label="Landmark name" />
          <FormInput
            name={`landmarks.${index}.distance`}
            label="Distance (metres)"
            type="number"
            min="0"
          />
          <Button
            variant="ghost"
            className="self-end"
            onClick={() => remove(index)}
          >
            Remove landmark
          </Button>
        </div>
      ))}
      <Button
        variant="secondary"
        className="w-fit"
        onClick={() =>
          append({ category: landmarkCategories[0], name: "", distance: 0 })
        }
      >
        + Add landmark
      </Button>
    </FormSection>
  );
}
