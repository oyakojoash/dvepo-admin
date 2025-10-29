import axios from "axios";

// ✅ Automatically switch between local and production
const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000" // Local backend
    : "https://devpo-backend-production.up.railway.app"; // Production backend

console.log("🌍 Admin Axios Base URL:", baseURL);

// ✅ Create axios instance with cookie (auth) support
const API = axios.create({
  baseURL,
  withCredentials: true, // ensures cookies (auth tokens) are sent securely
});

// ✅ Export base URL (useful for images, links, etc.)
export const API_BASE_URL = baseURL;

export default API;
