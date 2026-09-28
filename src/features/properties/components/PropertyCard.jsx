import { Link } from "react-router";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import { formatPrice, priceSuffix } from "../../../utils/formatPrice";
import { categoryLabel } from "../../../utils/constants";
import FavoriteButton from "../../favorites/components/FavoriteButton";
import PropertyImage from "./PropertyImage";

export default function PropertyCard({ property, variant = "vertical" }) {
  const horizontal = variant === "horizontal";
  return (
    <article
      className={`group min-w-0 ${horizontal ? "grid gap-5 border-b border-border pb-6 sm:grid-cols-[40%_1fr]" : ""}`}
    >
      <div
        className={`relative overflow-hidden bg-surface ${horizontal ? "aspect-[4/3]" : "aspect-[4/3]"}`}
      >
        <Link
          to={`/properties/${property.id}`}
          aria-label={`View ${property.title}`}
          className="block h-full"
        >
          <PropertyImage
            src={property.images[0]}
            alt={property.title}
            className="transition-transform duration-500 motion-safe:group-hover:scale-105"
          />
        </Link>
        <span className="absolute left-3 top-3 bg-background/95 px-3 py-1.5 text-xs">
          For {property.listingType === "buy" ? "sale" : "rent"}
        </span>
        <div className="absolute right-2 top-2">
          <FavoriteButton propertyId={property.id} />
        </div>
      </div>
      <div className={horizontal ? "self-center" : "pt-4"}>
        <p className="text-lg font-bold">
          {formatPrice(property)}
          <span className="text-xs font-normal text-muted">
            {priceSuffix(property)}
          </span>
        </p>
        <Link
          to={`/properties/${property.id}`}
          className="mt-2 block truncate text-base font-medium hover:underline"
        >
          {property.title}
        </Link>
        <p className="mt-2 flex items-center gap-1 text-xs text-muted">
          <MapPin size={13} />
          {property.location.area}, {property.location.city}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-3 text-xs text-muted">
          {property.category !== "land" && (
            <>
              <span className="flex items-center gap-1.5">
                <BedDouble size={14} />
                {property.bedrooms} beds
              </span>
              <span className="flex items-center gap-1.5">
                <Bath size={14} />
                {property.bathrooms} baths
              </span>
            </>
          )}
          <span className="flex items-center gap-1.5">
            <Maximize size={14} />
            {property.area} {property.areaUnit}
          </span>
          {variant === "compact" && (
            <span>{categoryLabel(property.category)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
