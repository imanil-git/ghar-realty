import { categories } from "../../../utils/constants";

export function readFilters(params, category) {
  const number = (key, fallback = "") => {
    const value = Number(params.get(key));
    return params.has(key) &&
      params.get(key).trim() !== "" &&
      Number.isFinite(value) &&
      value >= 0
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
      : (params.get("category") || "")
          .split(",")
          .filter((value) => categories.includes(value))
          .join(","),
    propertyType: params.get("propertyType") || "",
    minPrice: number("minPrice"),
    maxPrice: number("maxPrice"),
    bedrooms: number("bedrooms"),
    bathrooms: number("bathrooms"),
    minArea: number("minArea"),
    maxArea: number("maxArea"),
    parking: params.get("parking") === "true",
    furnished: params.get("furnished") === "true",
    balcony: params.get("balcony") === "true",
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
    if (
      value !== "" &&
      value !== undefined &&
      value !== null &&
      value !== false
    )
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
        (filters.location.toLowerCase() === "kathmandu valley"
          ? ["Kathmandu", "Lalitpur", "Bhaktapur"].includes(p.location.city)
          : location.includes(filters.location.toLowerCase()))) &&
      (!filters.listingType || p.listingType === filters.listingType) &&
      (!filters.category || filters.category.split(",").includes(p.category)) &&
      (!filters.propertyType || p.propertyType === filters.propertyType) &&
      (filters.minPrice === "" ||
        filters.minPrice == null ||
        (!p.priceOnCall && p.price >= Number(filters.minPrice))) &&
      (filters.maxPrice === "" ||
        filters.maxPrice == null ||
        (!p.priceOnCall && p.price <= Number(filters.maxPrice))) &&
      (!filters.bedrooms ||
        (Number(filters.bedrooms) >= 3
          ? p.bedrooms >= Number(filters.bedrooms)
          : p.bedrooms === Number(filters.bedrooms))) &&
      (!filters.bathrooms || p.bathrooms >= Number(filters.bathrooms)) &&
      (!filters.areaUnit || p.areaUnit === filters.areaUnit) &&
      (!filters.minArea || p.area >= Number(filters.minArea)) &&
      (filters.maxArea === "" ||
        filters.maxArea == null ||
        p.area <= Number(filters.maxArea)) &&
      (!filters.parking || p.cars > 0 || p.amenities?.includes("Parking")) &&
      (!filters.balcony || p.amenities?.includes("Balcony")) &&
      (!filters.furnished ||
        [
          "Full-furnished",
          "Fully furnished",
          "Full furnished",
          "Semi-furnished",
        ].includes(p.furnishing))
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
