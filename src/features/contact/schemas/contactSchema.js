import { z } from "zod";

export const enquiryTopics = [
  "Finding a property",
  "Listing a property",
  "My account",
  "Website feedback",
  "Something else",
];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(100, "Keep your name under 100 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  topic: z.enum(enquiryTopics, { error: "Choose a topic for your enquiry." }),
  message: z
    .string()
    .trim()
    .min(
      20,
      "Please include at least 20 characters so we can understand your question.",
    )
    .max(3000, "Keep your message under 3,000 characters."),
});
