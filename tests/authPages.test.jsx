import { beforeEach, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import LoginPage from "../src/pages/auth/LoginPage";
import SignupPage from "../src/pages/auth/SignupPage";
import ForgotPasswordPage from "../src/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../src/pages/auth/ResetPasswordPage";

const { mutateAsync, useAuthMutation } = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  useAuthMutation: vi.fn(),
}));
vi.mock("../src/features/auth/hooks/useAuthMutation", () => ({
  useAuthMutation,
}));
beforeEach(() => {
  mutateAsync.mockReset().mockResolvedValue({});
  useAuthMutation
    .mockReset()
    .mockReturnValue({ mutateAsync, isPending: false });
});
function mount(Page, url = "/") {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/account/favorites" element={<h1>Saved destination</h1>} />
        <Route path="*" element={<Page />} />
      </Routes>
    </MemoryRouter>,
  );
}
it.each([
  [LoginPage, "Login"],
  [SignupPage, "Create account"],
  [ForgotPasswordPage, "Send reset link"],
  [ResetPasswordPage, "Update password"],
])(
  "validates empty fields before calling the API (%s)",
  async (Page, submit) => {
    const user = userEvent.setup();
    mount(Page);
    await user.click(screen.getByRole("button", { name: submit }));
    expect(document.querySelector('[aria-invalid="true"]')).not.toBeNull();
    expect(mutateAsync).not.toHaveBeenCalled();
  },
);
it("logs in and preserves the intended destination", async () => {
  const user = userEvent.setup();
  mount(LoginPage, "/login?next=%2Faccount%2Ffavorites");
  await user.type(screen.getByLabelText(/^Email/), "aarav@example.com");
  await user.type(screen.getByLabelText(/^Password/), "GharDemo123!");
  await user.click(screen.getByRole("button", { name: "Login" }));
  expect(
    await screen.findByRole("heading", { name: "Saved destination" }),
  ).toBeTruthy();
  expect(useAuthMutation).toHaveBeenCalledWith("login");
  expect(mutateAsync).toHaveBeenCalledWith({
    email: "aarav@example.com",
    password: "GharDemo123!",
  });
});
it("submits signup with its own fields and action", async () => {
  const user = userEvent.setup();
  mount(SignupPage, "/signup?next=%2Faccount%2Ffavorites");
  for (const [label, value] of [
    [/^Full name/, "Sample User"],
    [/^Phone number/, "9800000000"],
    [/^Email/, "sample@example.com"],
    [/^Password/, "NewPassword123!"],
    [/^Confirm password/, "NewPassword123!"],
  ]) {
    await user.type(screen.getByLabelText(label), value);
  }
  await user.click(screen.getByRole("checkbox"));
  await user.click(screen.getByRole("button", { name: "Create account" }));
  expect(
    await screen.findByRole("heading", { name: "Saved destination" }),
  ).toBeTruthy();
  expect(useAuthMutation).toHaveBeenCalledWith("signup");
  expect(mutateAsync).toHaveBeenCalledWith(
    expect.objectContaining({ name: "Sample User", terms: true }),
  );
});
it("sends the reset token and retains values after an API failure", async () => {
  mutateAsync.mockRejectedValue({
    fields: { password: "Reset link expired." },
  });
  const user = userEvent.setup();
  mount(ResetPasswordPage, "/reset-password?token=sample-token");
  await user.type(screen.getByLabelText(/^New password/), "NewPassword123!");
  await user.type(
    screen.getByLabelText(/^Confirm password/),
    "NewPassword123!",
  );
  await user.click(screen.getByRole("button", { name: "Update password" }));
  expect(await screen.findByText("Reset link expired.")).toBeTruthy();
  expect(screen.getByLabelText(/^New password/).value).toBe("NewPassword123!");
  expect(mutateAsync).toHaveBeenCalledWith({
    password: "NewPassword123!",
    confirmPassword: "NewPassword123!",
    token: "sample-token",
  });
  expect(useAuthMutation).toHaveBeenCalledWith("resetPassword");
});
it("submits only email for password recovery", async () => {
  const user = userEvent.setup();
  mount(ForgotPasswordPage);
  await user.type(screen.getByLabelText(/^Email/), "sample@example.com");
  await user.click(screen.getByRole("button", { name: "Send reset link" }));
  expect(mutateAsync).toHaveBeenCalledWith({ email: "sample@example.com" });
  expect(useAuthMutation).toHaveBeenCalledWith("forgotPassword");
});
it.each([
  [ForgotPasswordPage, "Reset instructions prepared."],
  [ResetPasswordPage, "Password updated. You can log in now."],
])("keeps password recovery success states (%s)", (Page, message) => {
  useAuthMutation.mockReturnValue({
    mutateAsync,
    isSuccess: true,
    data: { message },
  });
  mount(Page);
  expect(screen.getByText(message)).toBeTruthy();
  expect(screen.queryByRole("button")).toBeNull();
  expect(
    screen.getByRole("link", { name: "Back to login" }).getAttribute("href"),
  ).toBe("/login");
});
