import { Link } from "react-router";

export default function PropertyMap({ properties = [] }) {
  return (
    <section
      aria-label="Illustrated property map preview"
      className="relative h-52 overflow-hidden bg-[#eceee9] sm:h-[270px] dark:brightness-75"
    >
      <svg
        viewBox="0 0 1000 270"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M0 12H425V92H0z M20 118H325V238H20z M600 20H1000V115H600z"
          fill="#e0e5d8"
        />
        <path
          d="M610 -20 550 57 565 102 520 150 555 208 535 290"
          fill="none"
          stroke="#c7dddf"
          strokeWidth="27"
        />
        {[
          "M-20 40 1020 174",
          "M-20 130 1020 85",
          "M-20 260 1020 232",
          "M365 -10 453 290",
          "M742 -20 681 300",
          "M957 -20 887 300",
        ].map((d) => (
          <g key={d}>
            <path d={d} stroke="#fff" strokeWidth="12" fill="none" />
            <path d={d} stroke="#d7d9d4" strokeWidth="2" fill="none" />
          </g>
        ))}
      </svg>
      <div className="absolute left-6 top-6 flex gap-6 text-[11px] uppercase tracking-wider text-[#6a7067]">
        <span>Kathmandu</span>
        <span>Bagmati river</span>
        <span>Lalitpur</span>
      </div>
      <div className="absolute left-6 top-[40%] flex gap-4 sm:gap-12">
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
      <span className="absolute bottom-14 left-6 text-[11px] text-[#777e74]">
        Jhamsikhel · Pulchowk · Sanepa
      </span>
      <span className="absolute bottom-2 right-3 text-[10px] text-[#62665f]">
        Illustrative map · Locations approximate
      </span>
    </section>
  );
}
