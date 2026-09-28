import { useFormContext } from "react-hook-form";
import FormSection from "./FormSection";
import { FormInput, FormSelect, MultiSelect } from "./FormControls";
import { features, furnishings, rooms } from "../../../utils/constants";

export default function AmenitiesSection() {
  const { watch } = useFormContext();
  const land = watch("category") === "land";
  return (
    <>
      <FormSection id="rooms" number="05" title="Parking & rooms">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          {[
            ["cars", "Car spaces"],
            ["bikes", "Bike spaces"],
            ...(!land
              ? [
                  ["bedrooms", "Bedrooms"],
                  ["halls", "Halls"],
                  ["kitchens", "Kitchens"],
                  ["diningRooms", "Dining rooms"],
                  ["bathrooms", "Bathrooms"],
                  ["floors", "Floors"],
                ]
              : []),
          ].map(([name, label]) => (
            <FormInput
              key={name}
              name={name}
              label={label}
              type="number"
              min="0"
              step={name === "floors" ? "0.5" : "1"}
            />
          ))}
        </div>
        {!land && (
          <FormSelect
            name="furnishing"
            label="Furnishing status"
            options={["Fully furnished", "Unfurnished", "Semi-furnished"]}
          />
        )}
      </FormSection>
      <FormSection id="amenities" number="06" title="Amenities & features">
        <MultiSelect
          name="amenities"
          label="Main features"
          options={features}
        />
        {!land && (
          <>
            <MultiSelect
              name="furnishings"
              label="Furnishings & appliances"
              options={furnishings}
            />
            <MultiSelect
              name="roomFeatures"
              label="Room features"
              options={rooms}
            />
          </>
        )}
      </FormSection>
    </>
  );
}
