import { ApiError } from "../../services/apiClient";
import { filterProperties } from "../../features/search/utils/filters";
import {
  mockDelay,
  readDatabase,
  requireUser,
  writeDatabase,
  currentUser,
} from "./database";

export const mockProperties = {
  async list(filters = {}) {
    await mockDelay();
    const items = filterProperties(
      readDatabase().properties.filter((p) => p.status === "published"),
      filters,
    );
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = 6;
    return {
      items: items.slice((page - 1) * limit, page * limit),
      total: items.length,
      pages: Math.ceil(items.length / limit),
      page,
    };
  },
  async detail(id) {
    await mockDelay();
    const property = readDatabase().properties.find((p) => p.id === id);
    if (
      !property ||
      (property.status !== "published" &&
        property.seller.id !== currentUser()?.id)
    )
      throw new ApiError("This property is unavailable.", 404);
    return property;
  },
  async featured() {
    await mockDelay();
    return readDatabase()
      .properties.filter((p) => p.status === "published" && p.featured)
      .slice(0, 4);
  },
  async recent() {
    await mockDelay();
    return readDatabase()
      .properties.filter((p) => p.status === "published")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 4);
  },
  async categories() {
    await mockDelay();
    return readDatabase()
      .properties.filter((p) => p.status === "published")
      .reduce(
        (counts, p) => ({
          ...counts,
          [p.category]: (counts[p.category] || 0) + 1,
        }),
        {},
      );
  },
  async mine() {
    await mockDelay();
    const user = requireUser();
    return readDatabase().properties.filter((p) => p.seller.id === user.id);
  },
  async save({ id, data }) {
    await mockDelay();
    const user = requireUser();
    const database = readDatabase();
    const existing = id
      ? database.properties.find((p) => p.id === id && p.seller.id === user.id)
      : null;
    if (id && !existing)
      throw new ApiError("You can only edit your own listings.", 403);
    const property = {
      ...data,
      id: id || crypto.randomUUID(),
      createdAt: existing?.createdAt || new Date().toISOString(),
      featured: existing?.featured || false,
      seller: { id: user.id, name: user.name, phone: data.phone || user.phone },
      updatedAt: new Date().toISOString(),
    };
    if (existing)
      database.properties = database.properties.map((p) =>
        p.id === id ? property : p,
      );
    else database.properties.unshift(property);
    writeDatabase(database);
    return property;
  },
  async remove(id) {
    await mockDelay();
    const user = requireUser();
    const database = readDatabase();
    if (
      !database.properties.some((p) => p.id === id && p.seller.id === user.id)
    )
      throw new ApiError("You can only delete your own listings.", 403);
    database.properties = database.properties.filter((p) => p.id !== id);
    Object.keys(database.favorites).forEach((key) => {
      database.favorites[key] = database.favorites[key].filter(
        (saved) => saved !== id,
      );
    });
    writeDatabase(database);
  },
  async favorites() {
    await mockDelay();
    const user = requireUser();
    const database = readDatabase();
    return database.properties.filter(
      (p) =>
        p.status === "published" &&
        (database.favorites[user.id] || []).includes(p.id),
    );
  },
  async toggleFavorite(id) {
    await mockDelay();
    const user = requireUser();
    const database = readDatabase();
    if (
      !database.properties.some((p) => p.id === id && p.status === "published")
    )
      throw new ApiError("This property is no longer available.", 404);
    const saved = database.favorites[user.id] || [];
    database.favorites[user.id] = saved.includes(id)
      ? saved.filter((item) => item !== id)
      : [...saved, id];
    writeDatabase(database);
  },
};
