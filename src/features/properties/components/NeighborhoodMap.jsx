import { Link } from "react-router";

export default function NeighborhoodMap({ properties, mapsUrl }) {
  return (
    <div>
      <div
        className="relative h-60 overflow-hidden bg-surface"
        role="region"
        aria-label="Illustrated neighborhood map"
      >
        <img
          src="/images/property-detail/neighborhood.svg"
          width="840"
          height="240"
          alt=""
          className="absolute left-0 top-0 max-w-none dark:brightness-75"
        />
        <div className="relative px-6 pt-6">
          <div className="flex gap-5 text-xs text-muted sm:gap-12">
            <span>KATHMANDU</span>
            <span>BAGMATI RIVER</span>
            <span>LALITPUR</span>
          </div>
          <div className="mt-10 flex gap-3 sm:gap-10 xl:gap-16">
            {properties.slice(0, 3).map((property) => (
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="flex min-h-12 items-center rounded-sm bg-action px-3 text-xs text-on-action sm:px-6"
                aria-label={`View ${property.title}`}
              >
                {property.priceOnCall
                  ? "On request"
                  : `NPR ${new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(property.price)}`}
              </Link>
            ))}
          </div>
          <div className="mt-10 flex gap-6 text-xs text-muted sm:gap-12">
            <span>Jhamsikhel</span>
            <span>Pulchowk</span>
            <span>Sanepa</span>
          </div>
        </div>
      </div>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="sr-only focus:not-sr-only focus:mt-3 focus:block"
      >
        Open property location in Google Maps (new tab)
      </a>
    </div>
  );
}
