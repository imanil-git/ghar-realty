import { beforeEach, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import MediaSection from "../src/features/property-management/components/MediaSection";
import { uploadImage } from "../src/services/uploadService";
vi.mock("../src/services/uploadService", () => ({ uploadImage: vi.fn() }));
const onBusyChange = vi.fn();
function Harness() {
  const methods = useForm({ defaultValues: { images: [], videoUrl: "" } });
  return (
    <FormProvider {...methods}>
      <MediaSection onBusyChange={onBusyChange} />
    </FormProvider>
  );
}
beforeEach(() => vi.clearAllMocks());
it("retries failed uploads and supports cover selection, reordering and removal", async () => {
  const user = userEvent.setup();
  uploadImage
    .mockRejectedValueOnce(new Error("Upload interrupted"))
    .mockResolvedValueOnce({ url: "/first.jpg" })
    .mockResolvedValueOnce({ url: "/second.jpg" });
  render(<Harness />);
  const input = screen.getByLabelText("Property photos");
  await user.upload(
    input,
    new File(["image"], "first.jpg", { type: "image/jpeg" }),
  );
  expect(await screen.findByRole("alert")).toHaveProperty(
    "textContent",
    "first.jpg: Upload interrupted",
  );
  await user.click(screen.getByRole("button", { name: "Retry photo" }));
  await screen.findByRole("button", { name: "Cover photo" });
  await user.upload(
    input,
    new File(["image"], "second.jpg", { type: "image/jpeg" }),
  );
  await user.click(await screen.findByRole("button", { name: "Make cover" }));
  expect(screen.getByAltText("Listing photo 1").getAttribute("src")).toBe(
    "/second.jpg",
  );
  await user.click(screen.getByRole("button", { name: "Move photo 1 right" }));
  expect(screen.getByAltText("Listing photo 1").getAttribute("src")).toBe(
    "/first.jpg",
  );
  await user.click(screen.getByRole("button", { name: "Remove photo 2" }));
  await waitFor(() => expect(screen.getAllByRole("img")).toHaveLength(1));
  expect(onBusyChange).toHaveBeenLastCalledWith(false);
});
