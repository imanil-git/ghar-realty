import { seedProperties } from "../data/properties";
import { ApiError } from "../../services/apiClient";

const key = "ghar-demo-v2";
export function readDatabase() {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      throw new ApiError(
        "Demo data could not be read. Clear this site’s demo storage to start again.",
      );
    }
  }
  return {
    properties: structuredClone(seedProperties),
    users: [],
    favorites: {},
    resets: [],
  };
}
export function writeDatabase(database) {
  try {
    localStorage.setItem(key, JSON.stringify(database));
  } catch {
    throw new ApiError(
      "Browser storage is full or unavailable. Remove some photos and try again; your form is still here.",
    );
  }
}

export async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(bits), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

let initialization;
export function initializeDemo() {
  if (!initialization)
    initialization = (async () => {
      if (readDatabase().users.some((u) => u.id === "demo-owner")) return;
      const salt = crypto.randomUUID();
      const hash = await passwordHash("GharDemo123!", salt);
      const database = readDatabase();
      if (!database.users.some((u) => u.id === "demo-owner")) {
        database.users.push({
          id: "demo-owner",
          name: "Aarav Shrestha",
          email: "aarav@example.com",
          phone: "+977 9800000000",
          salt,
          hash,
        });
        writeDatabase(database);
      }
    })().finally(() => {
      initialization = null;
    });
  return initialization;
}

export async function mockDelay() {
  await initializeDemo();
  await new Promise((resolve) => setTimeout(resolve, 120));
}

export function publicUser(user) {
  return user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar || "",
      }
    : null;
}

export function currentUser() {
  let session;
  try {
    session = JSON.parse(sessionStorage.getItem("ghar-session"));
  } catch {
    return null;
  }
  if (!session || session.expires <= Date.now()) return null;
  return (
    readDatabase().users.find((user) => user.id === session.userId) || null
  );
}

export function requireUser() {
  const user = currentUser();
  if (!user) {
    window.dispatchEvent(new Event("ghar:session-expired"));
    throw new ApiError("Your session ended. Please log in again.", 401);
  }
  return user;
}
export function startSession(user) {
  sessionStorage.setItem(
    "ghar-session",
    JSON.stringify({
      userId: user.id,
      expires: Date.now() + 8 * 60 * 60 * 1000,
    }),
  );
}
