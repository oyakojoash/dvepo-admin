import axios from 'axios';

// ✅ Set backend base URL
const baseURL = 'http://localhost:5000'; 

console.log("🌍 Axios Base URL:", baseURL);

// ✅ Create axios instance with cookie support
const API = axios.create({
  baseURL,
  withCredentials: true, // ensures cookies (auth tokens) are sent
});

// ✅ Export base URL (useful for image paths, etc.)
export const API_BASE_URL = baseURL;

export default API;
