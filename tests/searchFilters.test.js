import { describe, expect, it } from "vitest";
import {
  readFilters,
  filterParams,
  filterProperties,
} from "../src/features/search/utils/filters";
import { seedProperties } from "../src/mocks/data/properties";

const base = readFilters(new URLSearchParams());
describe("Property search controls", () => {
  it("round-trips multiple categories, amenities and area bounds", () => {
    const values = {
      ...base,
      category: "apartment,flat",
      maxArea: 1500,
      parking: true,
      balcony: true,
    };
    expect(readFilters(filterParams(values))).toEqual(values);
    expect(filterParams(values).has("furnished")).toBe(false);
  });
  it("keeps category routes locked and ignores unknown URL categories", () => {
    expect(
      readFilters(new URLSearchParams("category=house,invalid")).category,
    ).toBe("house");
    expect(
      readFilters(new URLSearchParams("category=house"), "land").category,
    ).toBe("land");
  });
  it("combines rent, category, exact bedrooms and area filters", () => {
    const matches = filterProperties(seedProperties, {
      ...base,
      listingType: "rent",
      category: "apartment,flat",
      bedrooms: 2,
      minArea: 800,
      maxArea: 1500,
      areaUnit: "sqft",
    });
    expect(matches.length).toBeGreaterThan(0);
    expect(
      matches.every(
        (p) => p.listingType === "rent" && p.bedrooms === 2 && p.area <= 1500,
      ),
    ).toBe(true);
  });
  it("supports Kathmandu Valley and three-or-more bedrooms", () => {
    const matches = filterProperties(seedProperties, {
      ...base,
      location: "Kathmandu Valley",
      bedrooms: 3,
    });
    expect(matches.length).toBeGreaterThan(0);
    expect(
      matches.every(
        (p) =>
          ["Kathmandu", "Lalitpur", "Bhaktapur"].includes(p.location.city) &&
          p.bedrooms >= 3,
      ),
    ).toBe(true);
  });
  it("excludes properties missing selected amenities", () => {
    const sample = {
      ...seedProperties[0],
      cars: 0,
      amenities: [],
      furnishing: "Unfurnished",
    };
    for (const key of ["parking", "balcony", "furnished"]) {
      expect(filterProperties([sample], { ...base, [key]: true })).toEqual([]);
    }
  });
});
