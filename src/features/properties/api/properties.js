import { isMockMode } from "../../../services/config";
import { request } from "../../../services/apiClient";
import { filterParams } from "../../search/utils/filters";
import { mockProperties } from "../../../mocks/api/properties";

export const propertyApi = {
  list: (filters) =>
    isMockMode
      ? mockProperties.list(filters)
      : request(`/properties?${filterParams(filters)}`),
  detail: (id) =>
    isMockMode
      ? mockProperties.detail(id)
      : request(`/properties/${encodeURIComponent(id)}`),
  featured: () =>
    isMockMode ? mockProperties.featured() : request("/properties/featured"),
  recent: () =>
    isMockMode ? mockProperties.recent() : request("/properties/recent"),
  categories: () =>
    isMockMode ? mockProperties.categories() : request("/categories"),
  mine: () => (isMockMode ? mockProperties.mine() : request("/me/properties")),
  save: ({ id, data }) =>
    isMockMode
      ? mockProperties.save({ id, data })
      : request(id ? `/properties/${encodeURIComponent(id)}` : "/properties", {
          method: id ? "PATCH" : "POST",
          data,
        }),
  remove: (id) =>
    isMockMode
      ? mockProperties.remove(id)
      : request(`/properties/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
