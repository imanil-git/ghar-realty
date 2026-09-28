import { useFormContext } from "react-hook-form";
import FormSection from "./FormSection";
import { FormInput, FormSelect } from "./FormControls";
import Checkbox from "../../../components/ui/Checkbox";

export default function PricingSection() {
  const { watch, register } = useFormContext();
  const onCall = watch("priceOnCall");
  const rent = watch("listingType") === "rent";
  return (
    <FormSection id="pricing" number="08" title="Pricing">
      <Checkbox
        label="Price on call"
        hint="The listing will display “Price on request” instead of an amount."
        {...register("priceOnCall")}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput
          name="price"
          label="Price (NPR)"
          required={!onCall}
          disabled={onCall}
          type="number"
          min="0"
        />
        <FormSelect
          name={rent ? "pricePeriod" : "priceBasis"}
          label={rent ? "Rental period" : "Pricing basis"}
          disabled={onCall}
        >
          {rent ? (
            <>
              <option value="month">Per month</option>
              <option value="year">Per year</option>
            </>
          ) : (
            <>
              <option value="total">Total amount</option>
              <option value="aana">Per aana</option>
              <option value="ropani">Per ropani</option>
              <option value="kattha">Per kattha</option>
              <option value="sqft">Per sq. ft.</option>
            </>
          )}
        </FormSelect>
      </div>
    </FormSection>
  );
}
