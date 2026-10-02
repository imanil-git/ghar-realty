import { expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "../src/features/contact/components/ContactForm";
import { contactSchema } from "../src/features/contact/schemas/contactSchema";

it("validates the enquiry before presenting a preview", async () => {
  const user = userEvent.setup();
  render(<ContactForm />);
  await user.click(screen.getByRole("button", { name: "Preview enquiry" }));
  expect(await screen.findByText("Enter your full name.")).toBeTruthy();
  expect(screen.queryByRole("status")).toBeNull();
  expect(screen.getByLabelText(/Full name/).getAttribute("aria-invalid")).toBe(
    "true",
  );
});

it("previews valid details without claiming delivery and clears a stale preview after edits", async () => {
  const user = userEvent.setup();
  render(<ContactForm />);
  await user.type(screen.getByLabelText(/Full name/), "Sample Visitor");
  await user.type(
    screen.getByLabelText(/Email address/),
    "visitor@example.com",
  );
  await user.selectOptions(
    screen.getByLabelText(/I’d like to ask about/),
    "Listing a property",
  );
  await user.type(
    screen.getByLabelText(/Your message/),
    "How can I update the photos on my listing?",
  );
  await user.click(screen.getByRole("button", { name: "Preview enquiry" }));
  expect(await screen.findByRole("status")).toHaveProperty(
    "textContent",
    " Enquiry prepared — not sent.",
  );
  await waitFor(() =>
    expect(document.activeElement.getAttribute("aria-labelledby")).toBe(
      "enquiry-preview-title",
    ),
  );
  await user.type(screen.getByLabelText(/Your message/), " Thank you.");
  expect(screen.queryByRole("status")).toBeNull();
  expect(screen.getByLabelText(/Email address/).value).toBe(
    "visitor@example.com",
  );
});

it("rejects whitespace-only messages and unsupported enquiry topics", () => {
  const values = {
    name: "Sample Visitor",
    email: "visitor@example.com",
    topic: "My account",
    message: " ".repeat(25),
  };
  expect(contactSchema.safeParse(values).success).toBe(false);
  expect(
    contactSchema.safeParse({
      ...values,
      topic: "Unknown topic",
      message: "Please help me with my account.",
    }).success,
  ).toBe(false);
});
