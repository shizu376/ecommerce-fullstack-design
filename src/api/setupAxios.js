import axios from "axios";
axios.interceptors.request.use((config) => {
  try {
    const jwt = localStorage.getItem("JWT_TOKEN");
    const adminKey = localStorage.getItem("ADMIN_API_KEY");
    config.headers = config.headers || {};
    if (jwt && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
    if (adminKey && !config.headers["x-admin-key"]) {
      config.headers["x-admin-key"] = adminKey;
    }
  } catch {}
  return config;
});
axios.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);


