import axios from "axios";

const API_URL = "https://portek-backend.onrender.com";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAll = (endpoint) => api.get(endpoint).then((r) => r.data.data);
export const getOne = (endpoint, id) =>
  api.get(`${endpoint}/${id}`).then((r) => r.data.data);
export const create = (endpoint, data) =>
  api.post(endpoint, data).then((r) => r.data);
export const update = (endpoint, id, data) =>
  api.put(`${endpoint}/${id}`, data).then((r) => r.data);
export const remove = (endpoint, id) =>
  api.delete(`${endpoint}/${id}`).then((r) => r.data);
export const patch = (endpoint, data) =>
  api.patch(endpoint, data).then((r) => r.data);

export const uploadMedia = async (file, type = "image") => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post(`/upload/${type}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.url;
};

export const getPublishedBlogs = () =>
  api.get("/blogs/published/list").then((r) => r.data.data);

export const getBlogBySlug = (slug) =>
  api.get(`/blogs/slug/${slug}`).then((r) => r.data.data);

export const sendMessage = (data) =>
  api.post("/messages", data).then((r) => r.data);

export const sendChat = (messages) =>
  api.post("/chat", { messages }).then((r) => r.data);

export default api;
