import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Header from "../src/components/layout/Header";
import Input from "../src/components/ui/Input";
import Button from "../src/components/ui/Button";
import { useUIStore } from "../src/store/uiStore";

describe("Accessible controls and header", () => {
  it("links field labels, hints and errors", () => {
    render(
      <Input label="Title" hint="Keep it short" error="Title is required" />,
    );
    const input = screen.getByRole("textbox", { name: "Title" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const ids = input.getAttribute("aria-describedby").split(" ");
    expect(ids.map((id) => document.getElementById(id).textContent)).toEqual([
      "Keep it short",
      "Title is required",
    ]);
  });
  it("disables loading actions", () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" }).disabled).toBe(true);
  });
  it("shows Login only to guests and listing action to signed-in users", () => {
    const { rerender } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    expect(screen.getAllByRole("link", { name: "Login" }).length).toBe(1);
    expect(screen.queryByRole("link", { name: "List a property" })).toBe(null);
    rerender(
      <MemoryRouter>
        <Header user={{ id: "one", name: "Aarav Shrestha" }} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole("link", { name: "Login" })).toBe(null);
    expect(
      screen
        .getByRole("link", { name: "List a property" })
        .getAttribute("href"),
    ).toBe("/account/properties/new");
    expect(
      screen.getByRole("link", { name: "Account for Aarav Shrestha" })
        .textContent,
    ).toContain("Aarav");
  });
  it("switches and persists the theme", async () => {
    useUIStore.getState().setTheme("light");
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("ghar-theme")).toBe("dark");
    useUIStore.getState().setTheme("light");
  });
});
