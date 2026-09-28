import { isMockMode } from "../../../services/config";
import { request } from "../../../services/apiClient";
import { mockProperties } from "../../../mocks/api/properties";

export const favoritesApi = {
  list: () =>
    isMockMode ? mockProperties.favorites() : request("/me/favorites"),
  toggle: ({ id, saved }) =>
    isMockMode
      ? mockProperties.toggleFavorite(id)
      : request(`/me/favorites/${encodeURIComponent(id)}`, {
          method: saved ? "DELETE" : "POST",
        }),
};
