// Editorial copy for the unchanged demo listings. Owner-edited records keep their own data.
const demoDetails = {
  "home-2": {
    originalTitle: "Light-filled living in Jhamsikhel",
    headline: "A brighter kind\nof everyday.",
    title: "Light-filled 2 BHK apartment in Jhamsikhel",
    images: [
      "/images/living.jpg",
      "/images/kitchen.jpg",
      "/images/interior.jpg",
    ],
    description:
      "Open living spaces, thoughtful finishes, and natural light from morning to evening. This contemporary apartment pairs everyday comfort with a neighborhood full of cafés, shops, and everything you need close by.",
    amenities: [
      "Dedicated parking",
      "Private balcony",
      "Water supply",
      "24-hour security",
      "Elevator",
      "Power backup",
    ],
    floorLabel: "3rd floor",
    depositMonths: 2,
    availability: "Available now",
    neighborhoodNote: "Jhamsikhel · 5 min to cafés · 10 min to Patan Hospital",
    ownerRole: "Property owner",
  },
  "home-6": {
    originalTitle: "Room for everyday living",
    title: "Contemporary living in Sanepa",
    images: [
      "/images/kitchen.jpg",
      "/images/living.jpg",
      "/images/interior.jpg",
    ],
  },
  "home-5": {
    originalTitle: "Your own corner of Lazimpat",
    title: "A calm corner of the city",
    images: [
      "/images/interior.jpg",
      "/images/living.jpg",
      "/images/kitchen.jpg",
    ],
  },
  "home-8": {
    originalTitle: "A home to make your own",
    title: "Thoughtfully designed family home",
  },
};
export function detailPresentation(property) {
  const demo = demoDetails[property.id];
  if (!demo || property.updatedAt || property.title !== demo.originalTitle)
    return property;
  const presentation = { ...demo };
  delete presentation.originalTitle;
  return { ...property, ...presentation };
}
