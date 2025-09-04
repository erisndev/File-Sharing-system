// src/services/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ================== Auth API ==================
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  updateMe: (data) => api.put("/auth/me", data),

  // Admin: User management
  getAllUsers: () => api.get("/auth/users"),
  getUserById: (id) => api.get(`/auth/users/${id}`),
  updateUserById: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUserById: (id) => api.delete(`/auth/users/${id}`),
};

// ================== Tender API ==================
export const tenderAPI = {
  getAll: (params) => api.get("/tenders", { params }),
  getById: (id) => api.get(`/tenders/${id}`),

  create: (data, files = [], onUploadProgress) => {
    const formData = new FormData();

    // Normalize types before appending
    const normalizedData = {
      ...data,
      budgetMin: data.budgetMin ? Number(data.budgetMin) : undefined,
      budgetMax: data.budgetMax ? Number(data.budgetMax) : undefined,
      deadline: data.deadline
        ? new Date(data.deadline).toISOString()
        : undefined,
    };

    // Append regular fields
    Object.keys(normalizedData).forEach((key) => {
      if (normalizedData[key] !== undefined && normalizedData[key] !== null) {
        if (Array.isArray(normalizedData[key])) {
          formData.append(key, normalizedData[key].join(",")); // tags, requirements
        } else {
          formData.append(key, normalizedData[key]);
        }
      }
    });

    // Append files
    files.forEach((file) => {
      formData.append("documents", file);
    });

    return api.post("/tenders", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
  },

  update: (id, data, files = [], onUploadProgress) => {
    const formData = new FormData();

    // Normalize types before appending
    const normalizedData = {
      ...data,
      budgetMin: data.budgetMin ? Number(data.budgetMin) : undefined,
      budgetMax: data.budgetMax ? Number(data.budgetMax) : undefined,
      deadline: data.deadline
        ? new Date(data.deadline).toISOString()
        : undefined,
    };

    Object.keys(normalizedData).forEach((key) => {
      if (normalizedData[key] !== undefined && normalizedData[key] !== null) {
        if (Array.isArray(normalizedData[key])) {
          formData.append(key, normalizedData[key].join(","));
        } else {
          formData.append(key, normalizedData[key]);
        }
      }
    });

    files.forEach((file) => {
      formData.append("documents", file);
    });

    return api.put(`/tenders/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
  },

  delete: (id) => api.delete(`/tenders/${id}`),
};

// ================== Application (Bid) API ==================
export const applicationAPI = {
  apply: (tenderId, data, config = {}) => api.post(`/applications/${tenderId}`, data, config),
  withdraw: (id) => api.put(`/applications/${id}/withdraw`),
  getByTender: (tenderId, params) => api.get(`/applications/received/${tenderId}`, { params }),
  getByBidder: (bidderId, params) => api.get(`/applications/by-bidder/${bidderId}`, { params }),
  getMine: (params) => api.get("/applications/my", { params }),
  getById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, status) =>
    api.put(`/applications/${id}/status`, { status }),

  // Issuer-specific: get bidders who applied to my tenders
  getBiddersForMyTenders: () => api.get("/issuer/bidders"),
};

// ================== File API ==================
export const fileAPI = {
  upload: (formData, onProgress) =>
    api.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress,
    }),
  download: (fileId) =>
    api.get(`/files/${fileId}/download`, { responseType: "blob" }),
  delete: (fileId) => api.delete(`/files/${fileId}`),
};

// ================== Notification API ==================
export const notificationAPI = {
  getAll: () => api.get("/notifications"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

export default api;

// ================== Issuer API ==================
export const issuerAPI = {
  // Get all bidders who applied to my tenders
  getBidders: () => api.get("/issuer/bidders"),
};
