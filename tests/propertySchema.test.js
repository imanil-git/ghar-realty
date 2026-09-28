import { describe, expect, it } from "vitest";
import {
  emptyProperty,
  draftSchema,
  publishSchema,
  measuredArea,
  listingPayload,
} from "../src/features/property-management/schemas/propertySchema";
import {
  readFilters,
  filterProperties,
} from "../src/features/search/utils/filters";
import { seedProperties } from "../src/mocks/data/properties";
import { safeReturnTo } from "../src/features/auth/utils/returnTo";

describe("Listing validation", () => {
  it("saves incomplete drafts but refuses to publish them", () => {
    expect(draftSchema.safeParse(emptyProperty).success).toBe(true);
    const result = publishSchema.safeParse(emptyProperty);
    expect(result.success).toBe(false);
    expect(
      result.error.issues.some((issue) => issue.path[0] === "images"),
    ).toBe(true);
  });
  it("accepts a complete listing and price-on-call without an amount", () => {
    const data = {
      ...emptyProperty,
      title: "A bright home",
      location: {
        province: "Bagmati",
        district: "Lalitpur",
        city: "Lalitpur",
        area: "Sanepa",
        mapUrl: "",
      },
      images: ["/images/hero.jpg"],
      area: 100,
      phone: "9800000000",
      description: "A quiet home with plenty of natural light.",
      policy: true,
      priceOnCall: true,
    };
    expect(publishSchema.safeParse(data).success).toBe(true);
    expect(
      publishSchema.safeParse({ ...data, priceOnCall: false }).success,
    ).toBe(false);
  });
  it("normalizes traditional areas and strips building details from land", () => {
    expect(
      measuredArea({
        ...emptyProperty,
        areaSystem: "hilly",
        measurements: {
          ...emptyProperty.measurements,
          ropani: 1,
          aana: 2,
          paisa: 2,
          daam: 4,
        },
      }),
    ).toEqual({ area: 18.75, areaUnit: "aana" });
    expect(
      measuredArea({
        ...emptyProperty,
        areaSystem: "terai",
        measurements: {
          ...emptyProperty.measurements,
          bigha: 1,
          kattha: 2,
          dhur: 10,
        },
      }),
    ).toEqual({ area: 22.5, areaUnit: "kattha" });
    expect(
      listingPayload(
        { ...emptyProperty, category: "land", bedrooms: 3 },
        "draft",
      ).bedrooms,
    ).toBe(0);
  });
  it("rejects negative values and unsafe links", () => {
    expect(draftSchema.safeParse({ ...emptyProperty, area: -1 }).success).toBe(
      false,
    );
    expect(
      draftSchema.safeParse({
        ...emptyProperty,
        videoUrl: "javascript:alert(1)",
      }).success,
    ).toBe(false);
  });
});

describe("Search URLs", () => {
  it("normalizes invalid page and filter values", () => {
    const result = readFilters(
      new URLSearchParams("page=-5&category=castle&sort=wrong&minPrice=oops"),
    );
    expect(result.page).toBe(1);
    expect(result.category).toBe("");
    expect(result.sort).toBe("latest");
    expect(result.minPrice).toBe("");
  });
  it("combines location, rent, category, budget and bedroom filters", () => {
    const filters = readFilters(
      new URLSearchParams(
        "listingType=rent&location=Lalitpur&category=apartment&maxPrice=80000&bedrooms=2",
      ),
    );
    expect(
      filterProperties(
        seedProperties.filter((p) => p.status === "published"),
        filters,
      ).map((p) => p.id),
    ).toEqual(["home-2"]);
  });
  it("keeps login return URLs local", () => {
    expect(safeReturnTo("//evil.example")).toBe("/account/profile");
    expect(safeReturnTo("https://evil.example")).toBe("/account/profile");
    expect(safeReturnTo("/account/properties/new?draft=1")).toBe(
      "/account/properties/new?draft=1",
    );
  });
});
