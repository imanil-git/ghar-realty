import { useState } from "react";
import { Link, useParams } from "react-router";
import { Check, MapPin } from "lucide-react";
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
import NeighborhoodMap from "../../features/properties/components/NeighborhoodMap";
import FavoriteButton from "../../features/favorites/components/FavoriteButton";
import { detailPresentation } from "../../features/properties/utils/detailPresentation";
import { formatPrice } from "../../utils/formatPrice";
import { categoryLabel } from "../../utils/constants";
import "../../styles/property-detail.css";

function Details({ record }) {
  const property = detailPresentation(record);
  const [image, setImage] = useState(null);
  const [copied, setCopied] = useState("");
  const related = useProperties({ page: 1, pageSize: 24, sort: "latest" });
  const suggestions = (related.data?.items || [])
    .filter((p) => p.id !== property.id)
    .sort((a, b) => {
      const preferred =
        property.id === "home-2" ? ["home-6", "home-5", "home-8"] : [];
      const score = (p) =>
        preferred.includes(p.id)
          ? 100 - preferred.indexOf(p.id)
          : Number(p.location.city === property.location.city) * 2 +
            Number(p.category === property.category);
      return score(b) - score(a);
    })
    .slice(0, 3)
    .map(detailPresentation);
  const mapProperties = [property, ...suggestions]
    .filter((p) => p.listingType === "rent")
    .sort((a, b) => a.price - b.price)
    .slice(0, 3);
  const maps = property.location.mapUrl?.startsWith("https://")
    ? property.location.mapUrl
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.location.area} ${property.location.city} Nepal`)}`;
  const phone = property.phone || property.seller.phone;
  const contactPhone = phone?.replace(/[^+\d]/g, "");
  const comforts = [
    ...new Set([
      ...(property.amenities || []),
      ...(property.furnishings || []),
    ]),
  ];
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
      <nav
        aria-label="Breadcrumb"
        className="mb-8 text-sm leading-5 text-muted"
      >
        <Link to="/properties" className="hover:underline">
          Properties
        </Link>{" "}
        /{" "}
        <Link
          to={`/properties?listingType=${property.listingType}`}
          className="hover:underline"
        >
          {property.listingType === "rent" ? "Rent" : "Buy"}
        </Link>{" "}
        / {property.location.city} / {property.location.area}
      </nav>
      <div
        className={`grid gap-4 ${property.images.length > 1 ? "sm:aspect-[1312/480] sm:grid-cols-[800fr_496fr] sm:grid-rows-2" : "sm:h-[480px]"}`}
      >
        {(property.images.length ? property.images : [null])
          .slice(0, 3)
          .map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => src && setImage(index)}
              disabled={!src}
              aria-label={`View photo ${index + 1}`}
              className={`min-h-0 overflow-hidden bg-surface ${index === 0 ? "aspect-[5/3] sm:row-span-2 sm:aspect-auto" : `aspect-[496/232] sm:aspect-auto ${property.images.length === 2 ? "sm:row-span-2" : ""}`}`}
            >
              <PropertyImage
                src={src}
                alt={`${property.title} — photo ${index + 1}`}
                eager={index === 0}
              />
            </button>
          ))}
      </div>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <p className="flex items-center gap-2 py-2 text-sm">
          <MapPin size={14} />
          {property.location.area}, {property.location.city}
        </p>
        <div className="flex flex-wrap gap-3">
          <FavoriteButton propertyId={property.id} showLabel />
          <Button variant="secondary" className="border-border" onClick={share}>
            Share
          </Button>
          <Button
            variant="secondary"
            className="border-border"
            disabled={!property.images.length}
            onClick={() => setImage(0)}
          >
            All {property.images.length} photos
          </Button>
        </div>
      </div>
      {copied && (
        <p role="status" className="mt-2 text-right text-xs">
          {copied}
        </p>
      )}
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,840fr)_minmax(0,408fr)] lg:gap-16">
        <article className="min-w-0 space-y-6">
          <h1 className="whitespace-pre-line text-4xl font-bold uppercase leading-[1.17] sm:text-5xl">
            {property.headline || property.title}
          </h1>
          <p className="text-[22px] font-semibold leading-[30px]">
            {property.title}
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3 border-y border-border py-6 text-base leading-6">
            {property.category !== "land" && (
              <>
                <span>{property.bedrooms} bedrooms</span>
                <span>{property.bathrooms} bathrooms</span>
              </>
            )}
            <span>
              {new Intl.NumberFormat("en").format(property.area)}{" "}
              {property.areaUnit === "sqft" ? "sq. ft." : property.areaUnit}
            </span>
            {property.floorLabel && <span>{property.floorLabel}</span>}
          </div>
          <section>
            <h2 className="text-[22px] font-semibold leading-[30px]">
              About this {categoryLabel(property.category).toLowerCase()}
            </h2>
            <div className="detail-description">
              <DescriptionText
                text={
                  property.description || "Contact the owner for more details."
                }
              />
            </div>
            {property.videoUrl?.startsWith("https://") && (
              <a
                href={property.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm underline"
              >
                Watch the video tour ↗
              </a>
            )}
          </section>
          <section>
            <h2 className="text-[22px] font-semibold leading-[30px]">
              Everyday comforts
            </h2>
            {comforts.length ? (
              <ul className="mt-5 grid gap-x-5 gap-y-2 text-sm sm:grid-cols-3">
                {comforts.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={14} className="mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">
                Ask the owner about the available amenities.
              </p>
            )}
          </section>
          <section>
            <h2 className="mb-6 text-[22px] font-semibold leading-[30px]">
              Know your neighborhood
            </h2>
            <NeighborhoodMap
              properties={mapProperties.length ? mapProperties : [property]}
              mapsUrl={maps}
            />
            <p className="mt-6 text-xs leading-[18px] text-muted">
              {property.neighborhoodNote ||
                `${property.location.area}, ${property.location.city} · ${property.location.province}, Nepal`}
            </p>
            {property.landmarks?.length > 0 && (
              <ul className="mt-3 space-y-2 text-xs text-muted">
                {property.landmarks.map((landmark, index) => (
                  <li key={index}>
                    {landmark.name} · {landmark.distance} m
                  </li>
                ))}
              </ul>
            )}
          </section>
        </article>
        <aside
          aria-label="Contact owner"
          className="space-y-6 bg-surface p-6 sm:p-8"
        >
          <p className="text-xs uppercase leading-[18px] text-muted">
            {property.listingType === "rent"
              ? `${property.pricePeriod === "month" ? "Monthly" : property.pricePeriod || "Monthly"} rent`
              : "Asking price"}
          </p>
          <p className="break-words text-4xl font-bold leading-[1.17] xl:text-5xl">
            {formatPrice(property)}
          </p>
          {(property.depositMonths || property.availability) && (
            <p className="text-xs leading-[18px] text-muted">
              {[
                property.depositMonths
                  ? `Deposit: ${property.depositMonths} months`
                  : null,
                property.availability,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          <div className="border-t border-border pt-6">
            <h2 className="text-[22px] font-semibold leading-[30px]">
              {property.seller.name}
            </h2>
            <p className="mt-6 text-sm text-muted">
              {property.ownerRole || "Listing contact"}
            </p>
          </div>
          {contactPhone ? (
            <div className="space-y-6">
              <a
                href={`tel:${contactPhone}`}
                className="flex min-h-12 items-center justify-center rounded-sm bg-action px-4 text-sm text-on-action"
              >
                Call owner
              </a>
              <a
                href={`sms:${contactPhone}?body=${encodeURIComponent(`Hello, I am interested in ${property.title}. Is it available for a viewing?`)}`}
                className="flex min-h-12 items-center justify-center rounded-sm border border-border bg-background px-4 text-sm"
                aria-label="Send a message using your SMS app"
              >
                Send a message
              </a>
            </div>
          ) : (
            <p className="text-sm text-muted">
              Contact details are not available.
            </p>
          )}
          <p className="text-xs leading-[18px] text-muted">
            Arrange a viewing before making a payment.
          </p>
        </aside>
      </div>
      <section className="mt-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs uppercase leading-[18px] text-muted">
              Similar properties
            </p>
            <h2 className="text-2xl font-semibold leading-tight sm:text-[32px] sm:leading-10">
              You might feel at home here, too.
            </h2>
          </div>
          <Link to="/properties" className="py-2 text-sm hover:underline">
            View all properties →
          </Link>
        </div>
        <QueryState query={related}>
          {() =>
            suggestions.length ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {suggestions.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    variant="editorial"
                    imageClassName="aspect-[416/264]"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">
                More homes will appear here as they become available.
              </p>
            )
          }
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
                key={property.images[image]}
                src={property.images[image]}
                alt={`${property.title}, photo ${image + 1}`}
                eager
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
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
              <span className="text-sm" aria-live="polite">
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
    <Container className="property-detail py-10 sm:py-16">
      <QueryState query={query}>
        {(property) => <Details key={property.id} record={property} />}
      </QueryState>
    </Container>
  );
}
