import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

/**
 * Interceptor to automatically attach Firebase ID Token to every request.
 */
api.interceptors.request.use(async (config) => {
  try {
    // Skip attaching token to the sync endpoint to avoid circular logic or initialization issues
    if (config.url?.includes("/api/auth/firebase")) {
      return config;
    }

    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error getting Firebase token:", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * Handle session expiry or unauthorized access.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If we get an unauthorized error even with a token, 
      // it might mean the user doesn't exist in our DB yet or token is invalid.
      console.warn("Unauthorized API call");
    }
    return Promise.reject(error);
  }
);

export default api;
