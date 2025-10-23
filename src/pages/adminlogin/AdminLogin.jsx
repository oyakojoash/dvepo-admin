import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import "./AdminLogin.css";

export default function AdminLogin() {
  const { setAdmin } = useContext(AdminContext);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (pwd) => pwd.length >= 6;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ------------------------- Conditional Backend URL -------------------------
  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:8080" // Correct port for local backend
      : "https://devpo-backend-production.up.railway.app";

  // ------------------------- Form Submission -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { fullName, email, password } = form;

    if (!validateEmail(email)) return setError("❌ Enter a valid email");
    if (!isLogin && !validatePassword(password))
      return setError("❌ Password must be at least 6 characters");

    setLoading(true);

    const url = isLogin
      ? `${BASE_URL}/api/admin/login`
      : `${BASE_URL}/api/admin/register`;

    const payload = isLogin ? { email, password } : { fullName, email, password };

    try {
      // Login/Register
      await axios.post(url, payload, { withCredentials: true });

      if (isLogin) {
        // Fetch admin session after login
        const adminRes = await axios.get(`${BASE_URL}/api/admin/me`, {
          withCredentials: true,
        });
        setAdmin(adminRes.data);
        setSuccess("✅ Login successful!");
        navigate("/admin");
      } else {
        setSuccess("✅ Admin registered successfully. Please login.");
        setIsLogin(true);
      }

      setForm({ fullName: "", email: "", password: "" });
    } catch (err) {
      console.error("Full error object:", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>{isLogin ? "Admin Login" : "Create Admin Account"}</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleSubmit} className="form">
          {!isLogin && (
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Admin Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "blue",
                fontSize: "14px",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p style={{ marginTop: "10px" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
