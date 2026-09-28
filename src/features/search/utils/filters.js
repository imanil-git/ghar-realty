import { categories } from "../../../utils/constants";

export function readFilters(params, category) {
  const number = (key, fallback = "") => {
    const value = Number(params.get(key));
    return params.has(key) && Number.isFinite(value) && value >= 0
      ? value
      : fallback;
  };
  return {
    location: params.get("location") || "",
    listingType: ["buy", "rent"].includes(params.get("listingType"))
      ? params.get("listingType")
      : "",
    category: categories.includes(category)
      ? category
      : categories.includes(params.get("category"))
        ? params.get("category")
        : "",
    propertyType: params.get("propertyType") || "",
    minPrice: number("minPrice"),
    maxPrice: number("maxPrice"),
    bedrooms: number("bedrooms"),
    bathrooms: number("bathrooms"),
    minArea: number("minArea"),
    areaUnit: params.get("areaUnit") || "",
    sort: ["latest", "price-asc", "price-desc"].includes(params.get("sort"))
      ? params.get("sort")
      : "latest",
    page: Math.max(1, Math.floor(number("page", 1))),
  };
}

export function filterParams(filters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== "" && value !== undefined && value !== null)
      params.set(key, String(value));
  }
  return params;
}

export function filterProperties(items, filters) {
  const result = items.filter((p) => {
    const location =
      `${p.location.city} ${p.location.area} ${p.location.district}`.toLowerCase();
    return (
      (!filters.location ||
        location.includes(filters.location.toLowerCase())) &&
      (!filters.listingType || p.listingType === filters.listingType) &&
      (!filters.category || p.category === filters.category) &&
      (!filters.propertyType || p.propertyType === filters.propertyType) &&
      (filters.minPrice === "" ||
        filters.minPrice == null ||
        (!p.priceOnCall && p.price >= Number(filters.minPrice))) &&
      (filters.maxPrice === "" ||
        filters.maxPrice == null ||
        (!p.priceOnCall && p.price <= Number(filters.maxPrice))) &&
      (!filters.bedrooms || p.bedrooms >= Number(filters.bedrooms)) &&
      (!filters.bathrooms || p.bathrooms >= Number(filters.bathrooms)) &&
      (!filters.areaUnit || p.areaUnit === filters.areaUnit) &&
      (!filters.minArea || p.area >= Number(filters.minArea))
    );
  });
  return result.sort((a, b) =>
    filters.sort === "price-asc"
      ? a.price - b.price
      : filters.sort === "price-desc"
        ? b.price - a.price
        : b.createdAt.localeCompare(a.createdAt),
  );
}
