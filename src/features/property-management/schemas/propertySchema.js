import { z } from "zod";
import { categories } from "../../../utils/constants";

const number = z.coerce
  .number()
  .min(0, "Use zero or a positive number.")
  .max(1e12, "This value is too large.");
const safeLink = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true;
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "Use a complete https:// link.");
export const draftSchema = z.object({
  title: z.string().trim().max(150),
  listingType: z.enum(["buy", "rent"]),
  category: z.enum(categories),
  propertyType: z.string(),
  buildYear: z
    .string()
    .refine(
      (value) => !value || /^\d{4}$/.test(value),
      "Enter a four-digit year.",
    ),
  calendar: z.enum(["BS", "AD"]),
  ownership: z.string(),
  location: z.object({
    province: z.string(),
    district: z.string(),
    city: z.string(),
    area: z.string(),
    mapUrl: safeLink,
  }),
  images: z.array(z.string()).max(12, "Choose up to 12 photos."),
  videoUrl: safeLink,
  facing: z.string(),
  areaSystem: z.enum(["hilly", "terai", "metric"]),
  measurements: z.object({
    ropani: number,
    aana: number,
    paisa: number,
    daam: number,
    bigha: number,
    kattha: number,
    dhur: number,
  }),
  area: number,
  areaUnit: z.string(),
  roadWidth: number,
  roadUnit: z.string(),
  roadType: z.string(),
  builtUpArea: number,
  builtUpUnit: z.string(),
  cars: number.int(),
  bikes: number.int(),
  bedrooms: number.int(),
  halls: number.int(),
  kitchens: number.int(),
  diningRooms: number.int(),
  bathrooms: number.int(),
  floors: number.multipleOf(0.5),
  furnishing: z.string(),
  amenities: z.array(z.string()),
  furnishings: z.array(z.string()),
  roomFeatures: z.array(z.string()),
  landmarks: z.array(
    z.object({
      category: z.string(),
      name: z.string().trim(),
      distance: number,
    }),
  ),
  currency: z.literal("NPR"),
  price: number,
  pricePeriod: z.string(),
  priceBasis: z.string(),
  priceOnCall: z.boolean(),
  description: z.string().trim().max(10000),
  phone: z.string().trim(),
  policy: z.boolean(),
  duration: z.literal(180),
});

export function measuredArea(data) {
  const m = data.measurements;
  if (data.areaSystem === "hilly")
    return {
      area:
        Number(m.ropani) * 16 +
        Number(m.aana) +
        Number(m.paisa) / 4 +
        Number(m.daam) / 16,
      areaUnit: "aana",
    };
  if (data.areaSystem === "terai")
    return {
      area: Number(m.bigha) * 20 + Number(m.kattha) + Number(m.dhur) / 20,
      areaUnit: "kattha",
    };
  return { area: Number(data.area), areaUnit: data.areaUnit };
}

export const publishSchema = draftSchema.superRefine((data, ctx) => {
  const issue = (path, message) =>
    ctx.addIssue({ code: "custom", path: path.split("."), message });
  if (data.title.length < 5)
    issue("title", "Enter a title with at least 5 characters.");
  for (const key of ["province", "district", "city", "area"])
    if (!data.location[key].trim())
      issue(`location.${key}`, "Enter the property location.");
  if (!data.images.length) issue("images", "Add at least one property photo.");
  if (measuredArea(data).area <= 0)
    issue(
      data.areaSystem === "metric"
        ? "area"
        : `measurements.${data.areaSystem === "hilly" ? "aana" : "kattha"}`,
      "Enter a total area greater than zero.",
    );
  if (!data.priceOnCall && data.price <= 0)
    issue("price", "Enter a price greater than zero, or select price on call.");
  if (data.description.length < 20)
    issue("description", "Describe the property in at least 20 characters.");
  if (!/^\+?[\d ()-]{7,20}$/.test(data.phone))
    issue("phone", "Enter a valid contact number.");
  if (!data.policy)
    issue("policy", "Accept the listing policy before publishing.");
  data.landmarks.forEach((landmark, index) => {
    if (!landmark.name)
      issue(
        `landmarks.${index}.name`,
        "Enter the landmark name or remove this row.",
      );
  });
});

export const emptyProperty = {
  title: "",
  listingType: "buy",
  category: "house",
  propertyType: "standard",
  buildYear: "",
  calendar: "BS",
  ownership: "Individual",
  location: { province: "", district: "", city: "", area: "", mapUrl: "" },
  images: [],
  videoUrl: "",
  facing: "",
  areaSystem: "metric",
  measurements: {
    ropani: 0,
    aana: 0,
    paisa: 0,
    daam: 0,
    bigha: 0,
    kattha: 0,
    dhur: 0,
  },
  area: 0,
  areaUnit: "sqft",
  roadWidth: 0,
  roadUnit: "feet",
  roadType: "",
  builtUpArea: 0,
  builtUpUnit: "sqft",
  cars: 0,
  bikes: 0,
  bedrooms: 0,
  halls: 0,
  kitchens: 0,
  diningRooms: 0,
  bathrooms: 0,
  floors: 1,
  furnishing: "Unfurnished",
  amenities: [],
  furnishings: [],
  roomFeatures: [],
  landmarks: [],
  currency: "NPR",
  price: 0,
  pricePeriod: "month",
  priceBasis: "total",
  priceOnCall: false,
  description: "",
  phone: "",
  policy: false,
  duration: 180,
};

export function formValues(property, user) {
  return {
    ...emptyProperty,
    ...property,
    phone: property?.phone || user?.phone || "",
    location: { ...emptyProperty.location, ...property?.location },
    measurements: { ...emptyProperty.measurements, ...property?.measurements },
  };
}

export function listingPayload(data, status) {
  const payload = { ...data, ...measuredArea(data), status };
  if (payload.category === "land") {
    for (const key of [
      "bedrooms",
      "bathrooms",
      "halls",
      "kitchens",
      "diningRooms",
      "floors",
      "builtUpArea",
    ])
      payload[key] = 0;
    payload.furnishing = "Unfurnished";
    payload.furnishings = [];
    payload.roomFeatures = [];
  }
  return payload;
}
