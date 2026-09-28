import { ApiError } from "../../services/apiClient";
import {
  currentUser,
  mockDelay,
  passwordHash,
  publicUser,
  readDatabase,
  requireUser,
  startSession,
  writeDatabase,
} from "./database";

export const mockAuth = {
  async me() {
    await mockDelay();
    return publicUser(currentUser());
  },
  async login({ email, password }) {
    await mockDelay();
    const user = readDatabase().users.find(
      (u) => u.email === email.toLowerCase().trim(),
    );
    if (!user || (await passwordHash(password, user.salt)) !== user.hash)
      throw new ApiError("Email or password is incorrect.");
    startSession(user);
    return publicUser(user);
  },
  async signup({ name, email, phone, password }) {
    await mockDelay();
    const salt = crypto.randomUUID();
    const hash = await passwordHash(password, salt);
    const database = readDatabase();
    email = email.toLowerCase().trim();
    if (database.users.some((u) => u.email === email))
      throw new ApiError("That email is already registered.", 409, {
        email: "Try logging in instead.",
      });
    const user = { id: crypto.randomUUID(), name, email, phone, salt, hash };
    database.users.push(user);
    writeDatabase(database);
    startSession(user);
    return publicUser(user);
  },
  async logout() {
    await mockDelay();
    sessionStorage.removeItem("ghar-session");
  },
  async forgotPassword({ email }) {
    await mockDelay();
    const database = readDatabase();
    const user = database.users.find(
      (u) => u.email === email.toLowerCase().trim(),
    );
    if (!user)
      return {
        message: "If an account exists, a reset link will be available.",
      };
    const token = crypto.randomUUID();
    database.resets = database.resets.filter((r) => r.userId !== user.id);
    database.resets.push({
      token,
      userId: user.id,
      expires: Date.now() + 15 * 60 * 1000,
    });
    writeDatabase(database);
    return { message: "Demo reset link created. No email was sent.", token };
  },
  async resetPassword({ token, password }) {
    await mockDelay();
    const reset = readDatabase().resets.find(
      (r) => r.token === token && r.expires > Date.now(),
    );
    if (!reset)
      throw new ApiError(
        "This reset link is invalid or expired. Request a new one.",
      );
    const salt = crypto.randomUUID();
    const hash = await passwordHash(password, salt);
    const database = readDatabase();
    const activeReset = database.resets.find(
      (r) => r.token === token && r.expires > Date.now(),
    );
    if (!activeReset) throw new ApiError("This reset link has expired.");
    const user = database.users.find((u) => u.id === reset.userId);
    Object.assign(user, { salt, hash });
    database.resets = database.resets.filter((r) => r.userId !== user.id);
    writeDatabase(database);
    sessionStorage.removeItem("ghar-session");
  },
  async updateProfile(data) {
    await mockDelay();
    const user = requireUser();
    const database = readDatabase();
    if (
      database.users.some(
        (u) => u.id !== user.id && u.email === data.email.toLowerCase(),
      )
    )
      throw new ApiError("That email is already registered.");
    const saved = database.users.find((u) => u.id === user.id);
    Object.assign(saved, {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      avatar: data.avatar || "",
    });
    database.properties.forEach((p) => {
      if (p.seller.id === user.id)
        Object.assign(p.seller, {
          name: saved.name,
          phone: saved.phone,
          avatar: saved.avatar,
        });
    });
    writeDatabase(database);
    return publicUser(saved);
  },
  async changePassword({ currentPassword, password }) {
    await mockDelay();
    const user = requireUser();
    if ((await passwordHash(currentPassword, user.salt)) !== user.hash)
      throw new ApiError("Current password is incorrect.");
    const salt = crypto.randomUUID();
    const hash = await passwordHash(password, salt);
    const database = readDatabase();
    Object.assign(
      database.users.find((u) => u.id === user.id),
      { salt, hash },
    );
    writeDatabase(database);
  },
};
