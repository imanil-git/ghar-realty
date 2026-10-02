import PropertyImage from "../../properties/components/PropertyImage";
import { formatPrice, priceSuffix } from "../../../utils/formatPrice";
import { measuredArea, publishSchema } from "../schemas/propertySchema";

export default function ListingPreview({ values }) {
  const area = measuredArea(values);
  const result = publishSchema.safeParse(values);
  const issues = result.success ? [] : result.error.issues;
  const complete = !issues.some(
    (issue) => !["images", "policy", "phone"].includes(issue.path[0]),
  );
  const contact = /^\+?[\d ()-]{7,20}$/.test(values.phone);
  return (
    <section aria-labelledby="listing-preview-title">
      <h2 id="listing-preview-title" className="mb-6 text-3xl font-semibold">
        Preview your listing
      </h2>
      <div className="aspect-[1040/440] overflow-hidden bg-surface">
        <PropertyImage
          key={values.images[0] || "no-cover"}
          src={values.images[0]}
          alt={values.title || "Property cover preview"}
        />
      </div>
      <h3 className="mt-6 text-3xl font-semibold">
        {values.title || "Untitled property"}
      </h3>
      <p className="mt-5 text-xl font-semibold">
        {formatPrice(values)}
        {priceSuffix(values)}
      </p>
      <p className="mt-6 text-sm text-muted">
        {[values.location.area, values.location.city]
          .filter(Boolean)
          .join(", ") || "Location not added"}{" "}
        ·{" "}
        {values.category !== "land" &&
          `${values.bedrooms} beds · ${values.bathrooms} baths · `}
        {area.area.toLocaleString()}{" "}
        {area.areaUnit === "sqft" ? "sq. ft." : area.areaUnit}
      </p>
      <ul className="my-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <li>{complete ? "✓ Details complete" : "○ Details need attention"}</li>
        <li>
          {values.images.length
            ? `✓ ${values.images.length} photos added`
            : "○ Add property photos"}
        </li>
        <li>
          {contact ? "✓ Contact number added" : "○ Add a valid contact number"}
        </li>
      </ul>
    </section>
  );
}
