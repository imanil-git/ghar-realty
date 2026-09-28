import { beforeEach, describe, expect, it } from "vitest";
import { mockAuth } from "../src/mocks/api/auth";
import { mockProperties } from "../src/mocks/api/properties";
import { emptyProperty } from "../src/features/property-management/schemas/propertySchema";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("Mock account and property lifecycle", () => {
  it("authenticates without storing plaintext passwords", async () => {
    await mockAuth.signup({
      name: "Test Owner",
      email: "owner@example.com",
      phone: "9800000001",
      password: "PrivateExample123!",
    });
    expect(localStorage.getItem("ghar-demo-v2")).not.toContain(
      "PrivateExample123!",
    );
    expect((await mockAuth.me()).email).toBe("owner@example.com");
    await mockAuth.logout();
    await expect(
      mockAuth.login({ email: "owner@example.com", password: "wrong" }),
    ).rejects.toThrow("incorrect");
    expect(
      (
        await mockAuth.login({
          email: "owner@example.com",
          password: "PrivateExample123!",
        })
      ).name,
    ).toBe("Test Owner");
  });
  it("enforces ownership and retains edits through draft/publication", async () => {
    await mockAuth.login({
      email: "aarav@example.com",
      password: "GharDemo123!",
    });
    const draft = await mockProperties.save({
      data: { ...emptyProperty, status: "draft", title: "Work in progress" },
    });
    expect((await mockProperties.mine()).some((p) => p.id === draft.id)).toBe(
      true,
    );
    await mockProperties.save({
      id: draft.id,
      data: { ...draft, status: "published", title: "Ready to view" },
    });
    expect((await mockProperties.detail(draft.id)).title).toBe("Ready to view");
    await expect(mockProperties.remove("home-4")).rejects.toThrow(
      "own listings",
    );
    await mockProperties.remove(draft.id);
    await expect(mockProperties.detail(draft.id)).rejects.toThrow(
      "unavailable",
    );
  });
  it("protects drafts and expires sessions", async () => {
    await expect(mockProperties.detail("draft-1")).rejects.toThrow(
      "unavailable",
    );
    await mockAuth.login({
      email: "aarav@example.com",
      password: "GharDemo123!",
    });
    expect((await mockProperties.detail("draft-1")).status).toBe("draft");
    sessionStorage.setItem(
      "ghar-session",
      JSON.stringify({ userId: "demo-owner", expires: 1 }),
    );
    expect(await mockAuth.me()).toBe(null);
    await expect(mockProperties.mine()).rejects.toThrow("session ended");
  });
  it("supports saved homes and one-time password reset links", async () => {
    await mockAuth.login({
      email: "aarav@example.com",
      password: "GharDemo123!",
    });
    await mockProperties.toggleFavorite("home-4");
    expect((await mockProperties.favorites()).map((p) => p.id)).toEqual([
      "home-4",
    ]);
    await mockProperties.toggleFavorite("home-4");
    expect(await mockProperties.favorites()).toEqual([]);
    const { token } = await mockAuth.forgotPassword({
      email: "aarav@example.com",
    });
    await mockAuth.resetPassword({ token, password: "UpdatedDemo123!" });
    await expect(
      mockAuth.resetPassword({ token, password: "Again12345" }),
    ).rejects.toThrow("invalid or expired");
    await expect(
      mockAuth.login({ email: "aarav@example.com", password: "GharDemo123!" }),
    ).rejects.toThrow("incorrect");
    expect(
      (
        await mockAuth.login({
          email: "aarav@example.com",
          password: "UpdatedDemo123!",
        })
      ).id,
    ).toBe("demo-owner");
  });
});
