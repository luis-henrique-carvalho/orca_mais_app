import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

let isRefreshing = false;
let failedRequestQueue: {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}[] = [];

const api = axios.create({
  baseURL: "http://192.168.200.5:3000",
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      (error.response.data as { errors: { auth: string } }).errors.auth ===
        "Your session expired. Please sign in again to continue."
    ) {
      const originalConfig = error.config!;
      const refreshToken = await SecureStore.getItemAsync("refresh_token");

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data } = await api.post("/api/auth/refresh-token", {
            refresh_token: JSON.parse(refreshToken!).value,
          });

          await SecureStore.setItemAsync(
            "auth_token",
            JSON.stringify(data.token)
          );
          await SecureStore.setItemAsync(
            "refresh_token",
            JSON.stringify(data.refresh_token)
          );

          api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

          failedRequestQueue.forEach((request) =>
            request.onSuccess(data.token)
          );
          failedRequestQueue = [];

          if (originalConfig.headers) {
            originalConfig.headers["Authorization"] = `Bearer ${data.token}`;
          }

          return api(originalConfig);
        } catch (err) {
          failedRequestQueue.forEach((request) =>
            request.onFailure(err as AxiosError)
          );
          failedRequestQueue = [];
          throw err;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedRequestQueue.push({
          onSuccess: (token: string) => {
            originalConfig.headers!["Authorization"] = `Bearer ${token}`;
            resolve(api(originalConfig));
          },
          onFailure: (err: AxiosError) => {
            reject(err);
          },
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
