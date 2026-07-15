import axios from "axios";
import { toast } from "react-toastify";

type AuthStateShape = {
  token: string;
};

type AuthHandlers = {
  getAuthState: () => AuthStateShape | undefined;
  onAuthLogout: () => void;
};

let authHandlers: AuthHandlers | null = null;

export const configureApiClientAuth = (handlers: AuthHandlers) => {
  authHandlers = handlers;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/local",
});

apiClient.interceptors.request.use((config) => {
  const token = authHandlers?.getAuthState()?.token;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && authHandlers) {
      authHandlers.onAuthLogout();
      toast.error("Tu sesión expiró. Vuelve a iniciar sesión.");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
