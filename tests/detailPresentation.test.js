import { describe, expect, it } from "vitest";
import { detailPresentation } from "../src/features/properties/utils/detailPresentation";
import { seedProperties } from "../src/mocks/data/properties";

describe("Detail page presentation", () => {
  const sample = seedProperties.find((property) => property.id === "home-2");
  it("adds reference copy without mutating sample data or price", () => {
    const result = detailPresentation(sample);
    expect(result.headline).toBe("A brighter kind\nof everyday.");
    expect(result.images).toEqual([
      "/images/living.jpg",
      "/images/kitchen.jpg",
      "/images/interior.jpg",
    ]);
    expect(result.price).toBe(sample.price);
    expect(sample.headline).toBeUndefined();
    expect(sample.title).toBe("Light-filled living in Jhamsikhel");
  });
  it("never replaces owner edits with reference copy", () => {
    const edited = {
      ...sample,
      updatedAt: "2026-10-01",
      images: ["/custom.jpg"],
    };
    expect(detailPresentation(edited)).toBe(edited);
    const renamed = { ...sample, title: "Owner's title" };
    expect(detailPresentation(renamed)).toBe(renamed);
  });
  it("leaves non-reference listings unchanged", () => {
    expect(detailPresentation(seedProperties[0])).toBe(seedProperties[0]);
  });
});
