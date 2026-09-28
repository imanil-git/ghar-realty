import { isMockMode } from "../../../services/config";
import { request } from "../../../services/apiClient";
import { mockAuth } from "../../../mocks/api/auth";

export const authApi = {
  me: () => (isMockMode ? mockAuth.me() : request("/auth/me")),
  login: (data) =>
    isMockMode
      ? mockAuth.login(data)
      : request("/auth/login", { method: "POST", data }),
  signup: (data) =>
    isMockMode
      ? mockAuth.signup(data)
      : request("/auth/signup", { method: "POST", data }),
  logout: () =>
    isMockMode
      ? mockAuth.logout()
      : request("/auth/logout", { method: "POST" }),
  forgotPassword: (data) =>
    isMockMode
      ? mockAuth.forgotPassword(data)
      : request("/auth/forgot-password", { method: "POST", data }),
  resetPassword: (data) =>
    isMockMode
      ? mockAuth.resetPassword(data)
      : request("/auth/reset-password", { method: "POST", data }),
  updateProfile: (data) =>
    isMockMode
      ? mockAuth.updateProfile(data)
      : request("/me", { method: "PATCH", data }),
  changePassword: (data) =>
    isMockMode
      ? mockAuth.changePassword(data)
      : request("/auth/change-password", { method: "POST", data }),
};
