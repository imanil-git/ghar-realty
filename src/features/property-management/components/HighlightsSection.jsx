import { useFormContext } from "react-hook-form";
import FormSection from "./FormSection";
import { FormInput, FormSelect } from "./FormControls";
import { directions, roadTypes } from "../../../utils/constants";

export default function HighlightsSection() {
  const { watch, setValue, getValues } = useFormContext();
  const system = watch("areaSystem");
  const land = watch("category") === "land";
  return (
    <FormSection id="highlights" number="04" title="Property highlights">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormSelect name="facing" label="Facing" options={directions}>
          <option value="">Not specified</option>
        </FormSelect>
        <FormSelect
          name="areaSystem"
          label="Area measurement system"
          onValueChange={(value) => {
            if (
              value === "metric" &&
              !["sqft", "sqm"].includes(getValues("areaUnit"))
            )
              setValue("areaUnit", "sqft", { shouldDirty: true });
          }}
        >
          <option value="hilly">Hilly (Ropani / Aana)</option>
          <option value="terai">Terai (Bigha / Kattha)</option>
          <option value="metric">Square metres / feet</option>
        </FormSelect>
      </div>
      {system !== "metric" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(system === "hilly"
            ? ["ropani", "aana", "paisa", "daam"]
            : ["bigha", "kattha", "dhur"]
          ).map((unit) => (
            <FormInput
              key={unit}
              name={`measurements.${unit}`}
              label={unit.charAt(0).toUpperCase() + unit.slice(1)}
              type="number"
              min="0"
              step="any"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput
            name="area"
            label="Total area"
            type="number"
            min="0"
            step="any"
            required
          />
          <FormSelect
            name="areaUnit"
            label="Area unit"
            options={["sqft", "sqm"]}
          />
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput
          name="roadWidth"
          label="Road access width"
          type="number"
          min="0"
          step="any"
        />
        <FormSelect
          name="roadUnit"
          label="Road width unit"
          options={["feet", "metres"]}
        />
        {!land && (
          <>
            <FormInput
              name="builtUpArea"
              label="Built-up area"
              type="number"
              min="0"
              step="any"
            />
            <FormSelect
              name="builtUpUnit"
              label="Built-up unit"
              options={["sqft", "sqm"]}
            />
          </>
        )}
        <FormSelect name="roadType" label="Road type" options={roadTypes}>
          <option value="">Not specified</option>
        </FormSelect>
      </div>
    </FormSection>
  );
}
