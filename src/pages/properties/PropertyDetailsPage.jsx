import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  Phone,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  ArrowLeft,
} from "lucide-react";
import Container from "../../components/layout/Container";
import DescriptionText from "../../components/ui/DescriptionText";
import QueryState from "../../components/ui/QueryState";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import {
  useProperty,
  useProperties,
} from "../../features/properties/hooks/useProperties";
import PropertyImage from "../../features/properties/components/PropertyImage";
import PropertyCard from "../../features/properties/components/PropertyCard";
import FavoriteButton from "../../features/favorites/components/FavoriteButton";
import { formatPrice, priceSuffix } from "../../utils/formatPrice";
import { categoryLabel } from "../../utils/constants";

function Details({ property }) {
  const [image, setImage] = useState(null);
  const [copied, setCopied] = useState("");
  const related = useProperties({
    category: property.category,
    page: 1,
    sort: "latest",
  });
  const maps = property.location.mapUrl?.startsWith("https://")
    ? property.location.mapUrl
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.location.area} ${property.location.city} Nepal`)}`;
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied("Link copied.");
    } catch {
      setCopied("Copy the page URL from your address bar to share.");
    }
  }
  return (
    <>
      <title>{property.title} | Ghar Realty</title>
      <div className="mb-6 flex flex-wrap justify-between gap-3">
        <Link to="/properties" className="flex items-center gap-2 text-sm">
          <ArrowLeft size={17} />
          All properties
        </Link>
        <span className="text-xs text-muted">
          {categoryLabel(property.category)} / {property.location.city}
        </span>
      </div>
      <div className="grid auto-cols-[90%] grid-flow-col gap-3 overflow-x-auto snap-x sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-4">
        {(property.images.length ? property.images : [null])
          .slice(0, 3)
          .map((src, i) => (
            <button
              key={src + i}
              onClick={() => src && setImage(i)}
              aria-label={`View photo ${i + 1}`}
              disabled={!src}
              className={`aspect-[4/3] snap-start overflow-hidden ${i === 0 ? "sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-96" : "sm:col-span-2 sm:max-h-64"}`}
            >
              <PropertyImage
                src={src}
                alt={`${property.title} — photo ${i + 1}`}
                eager={i === 0}
              />
            </button>
          ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-sm text-muted">
          <MapPin size={17} />
          {property.location.area}, {property.location.city}
        </p>
        <div className="flex items-center gap-3">
          <FavoriteButton propertyId={property.id} />
          <Button variant="secondary" onClick={share}>
            Share
          </Button>
        </div>
      </div>
      {copied && (
        <p role="status" className="mt-2 text-right text-xs">
          {copied}
        </p>
      )}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <article className="min-w-0">
          <p className="mb-4 text-3xl font-bold">
            {formatPrice(property)}
            <span className="text-sm font-normal text-muted">
              {priceSuffix(property)}
            </span>
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {property.title}
          </h1>
          <div className="my-7 flex flex-wrap gap-6 border-y border-border py-5 text-sm">
            {property.category !== "land" && (
              <>
                <span className="flex items-center gap-2">
                  <BedDouble size={18} />
                  {property.bedrooms} bedrooms
                </span>
                <span className="flex items-center gap-2">
                  <Bath size={18} />
                  {property.bathrooms} bathrooms
                </span>
              </>
            )}
            <span className="flex items-center gap-2">
              <Maximize size={18} />
              {property.area} {property.areaUnit}
            </span>
          </div>
          <h2 className="text-xl font-semibold">About this property</h2>
          <DescriptionText text={property.description} />
          {property.videoUrl?.startsWith("https://") && (
            <a
              href={property.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex min-h-11 items-center text-sm underline"
            >
              Watch the video tour ↗
            </a>
          )}
          <h2 className="mt-9 text-xl font-semibold">Amenities & details</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ...(property.amenities || []),
              ...(property.furnishings || []),
            ].map((feature) => (
              <span
                key={feature}
                className="border border-border px-3 py-2 text-xs"
              >
                {feature}
              </span>
            ))}
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-5 text-sm">
            {[
              ["Facing", property.facing],
              ["Furnishing", property.furnishing],
              ["Road", property.roadType],
              ["Ownership", property.ownership],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-muted">{label}</dt>
                <dd className="mt-1">{value || "Not specified"}</dd>
              </div>
            ))}
          </dl>
          <h2 className="mt-9 text-xl font-semibold">The neighborhood</h2>
          <div className="mt-4 border border-border bg-surface p-6">
            <p className="text-sm leading-6">
              {property.location.area}, {property.location.city}
              <br />
              {property.location.province}, Nepal
            </p>
            <a
              href={maps}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex min-h-11 items-center text-sm underline"
            >
              Explore location on Google Maps ↗
            </a>
          </div>
          {property.landmarks?.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {property.landmarks.map((landmark, i) => (
                <li key={i}>
                  {landmark.name} · {landmark.distance} m · {landmark.category}
                </li>
              ))}
            </ul>
          )}
        </article>
        <aside className="self-start border border-border p-6 lg:sticky lg:top-32">
          <p className="text-xs uppercase tracking-widest text-muted">
            Your point of contact
          </p>
          <h2 className="mt-5 text-xl font-semibold">{property.seller.name}</h2>
          <p className="mt-2 text-sm text-muted">
            Ask a question or arrange a visit.
          </p>
          <a
            href={`tel:${property.phone || property.seller.phone}`}
            className="mt-6 flex min-h-12 items-center justify-center gap-3 bg-action px-4 text-sm text-on-action"
          >
            <Phone size={17} />
            {property.phone || property.seller.phone}
          </a>
          <p className="mt-4 text-xs leading-5 text-muted">
            Check the property and ownership documents in person before making a
            commitment.
          </p>
        </aside>
      </div>
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="mb-6 text-2xl font-semibold">You might also like</h2>
        <QueryState query={related}>
          {(data) => (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {data.items
                .filter((p) => p.id !== property.id)
                .slice(0, 3)
                .map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
            </div>
          )}
        </QueryState>
      </section>
      <Modal
        title="Property gallery"
        wide
        open={image !== null}
        onClose={() => setImage(null)}
      >
        {image !== null && (
          <>
            <div className="aspect-[4/3]">
              <PropertyImage
                src={property.images[image]}
                alt={`${property.title}, photo ${image + 1}`}
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() =>
                  setImage(
                    (image - 1 + property.images.length) %
                      property.images.length,
                  )
                }
              >
                Previous
              </Button>
              <span className="text-sm">
                {image + 1} / {property.images.length}
              </span>
              <Button
                variant="secondary"
                onClick={() => setImage((image + 1) % property.images.length)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
export default function PropertyDetailsPage() {
  const { id } = useParams();
  const query = useProperty(id);
  return (
    <Container className="py-10 sm:py-14">
      <QueryState query={query}>
        {(property) => <Details key={property.id} property={property} />}
      </QueryState>
    </Container>
  );
}
