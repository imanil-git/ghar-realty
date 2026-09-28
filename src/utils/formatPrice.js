export function formatPrice(property) {
  if (property.priceOnCall) return "Price on request";
  if (!property.price) return "Price not set";
  return `NPR ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(property.price)}`;
}

export function priceSuffix(property) {
  if (property.priceOnCall) return "";
  if (property.listingType === "rent")
    return ` / ${property.pricePeriod || "month"}`;
  return property.priceBasis && property.priceBasis !== "total"
    ? ` / ${property.priceBasis}`
    : "";
}
