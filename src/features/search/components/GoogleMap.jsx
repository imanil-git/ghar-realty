import { Link } from "react-router";

const GoogleMap = ({ properties = [] }) => {
  return (
    <section
      aria-label="Illustrated property map preview"
      className="relative h-52 overflow-hidden bg-[#eceee9] sm:h-[270px] dark:brightness-75"
    >
      <iframe
        className="absolute inset-0 h-full w-full"
        src="https://www.google.com/maps?q=27.6766,85.3247&z=14&output=embed"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      ></iframe>
      <div className="absolute left-6 top-[40%] flex gap-8 sm:gap-38">
        {properties.slice(0, 3).map((property) => (
          <Link
            key={property.id}
            to={`/properties/${property.id}`}
            aria-label={`View ${property.title}`}
            className="rounded-sm bg-[#1e1e1b] px-3 py-3 text-xs font-semibold text-white shadow-sm sm:px-6"
          >
            {property.priceOnCall
              ? "On request"
              : `NPR ${new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(property.price)}`}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default GoogleMap;
