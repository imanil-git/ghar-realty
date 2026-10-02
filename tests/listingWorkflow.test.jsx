import { beforeEach, expect, it, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import PropertyForm from "../src/features/property-management/components/PropertyForm";
import { emptyProperty } from "../src/features/property-management/schemas/propertySchema";

const { save } = vi.hoisted(() => ({ save: vi.fn() }));
vi.mock(
  "../src/features/property-management/hooks/usePropertyMutation",
  () => ({
    usePropertyMutation: () => ({ mutateAsync: save, isPending: false }),
  }),
);
beforeEach(() => {
  cleanup();
  save.mockReset();
  window.scrollTo = vi.fn();
  HTMLElement.prototype.scrollIntoView = vi.fn();
});
function mount(property) {
  const router = createMemoryRouter(
    [
      {
        path: "*",
        element: (
          <PropertyForm
            property={property}
            user={{ name: "Owner", phone: "9800000000" }}
          />
        ),
      },
    ],
    { initialEntries: ["/account/properties/new"] },
  );
  render(<RouterProvider router={router} />);
  return userEvent.setup();
}
it("retains edited values between steps and never publishes from Preview", async () => {
  const user = mount();
  await user.type(
    screen.getByLabelText(/Property title/),
    "A sunny learning home",
  );
  await user.click(
    screen.getByRole("button", { name: "Continue to photos →" }),
  );
  expect(screen.getByRole("heading", { name: "Property photos" })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Preview property →" }));
  expect(
    screen.getByRole("heading", { name: "A sunny learning home" }),
  ).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Publish property" })).toBeNull();
  expect(save).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "Edit details" }));
  expect(screen.getByLabelText(/Property title/).value).toBe(
    "A sunny learning home",
  );
});
it("validates on the Publish stage and returns to the invalid details", async () => {
  const user = mount();
  await user.click(screen.getByRole("button", { name: "4. Publish" }));
  await user.click(screen.getByRole("button", { name: "Publish property" }));
  await waitFor(() =>
    expect(
      screen.getByLabelText(/Property title/).getAttribute("aria-invalid"),
    ).toBe("true"),
  );
  await waitFor(() =>
    expect(
      screen
        .getByRole("button", { name: "1. Details" })
        .getAttribute("aria-current"),
    ).toBe("step"),
  );
  expect(save).not.toHaveBeenCalled();
});
it("publishes a complete listing with its existing id only on final confirmation", async () => {
  const property = {
    ...emptyProperty,
    id: "existing-id",
    title: "A complete listing",
    description: "A quiet home with plenty of natural light.",
    location: {
      province: "Bagmati",
      district: "Lalitpur",
      city: "Lalitpur",
      area: "Sanepa",
      mapUrl: "",
    },
    phone: "9800000000",
    area: 1200,
    price: 65000,
    images: ["/images/living.jpg"],
    policy: true,
  };
  save.mockResolvedValue({ ...property, status: "published" });
  const user = mount(property);
  await user.click(screen.getByRole("button", { name: "3. Preview" }));
  expect(save).not.toHaveBeenCalled();
  await user.click(
    screen.getByRole("button", { name: "Continue to publish →" }),
  );
  await user.click(screen.getByRole("button", { name: "Publish property" }));
  await waitFor(() =>
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "existing-id",
        data: expect.objectContaining({
          status: "published",
          title: "A complete listing",
        }),
      }),
    ),
  );
});
