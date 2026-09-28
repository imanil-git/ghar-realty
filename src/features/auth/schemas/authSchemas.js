import { z } from "zod";

const email = z.string().trim().email("Enter a valid email address.");
const password = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(128, "Use no more than 128 characters.");
export const phone = z
  .string()
  .trim()
  .regex(/^\+?[\d ()-]{7,20}$/, "Enter a valid phone number.");
export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email,
  phone,
  avatar: z.string().optional(),
});
const matches = (data) => data.password === data.confirmPassword;
const confirmError = {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
};
export const authSchemas = {
  login: z.object({
    email,
    password: z.string().min(1, "Enter your password."),
  }),
  signup: profileSchema
    .extend({
      password,
      confirmPassword: z.string(),
      terms: z.boolean().refine(Boolean, "Accept the terms to continue."),
    })
    .refine(matches, confirmError),
  forgot: z.object({ email }),
  reset: z
    .object({ password, confirmPassword: z.string() })
    .refine(matches, confirmError),
  change: z
    .object({
      currentPassword: z.string().min(1, "Enter your current password."),
      password,
      confirmPassword: z.string(),
    })
    .refine(matches, confirmError),
};
