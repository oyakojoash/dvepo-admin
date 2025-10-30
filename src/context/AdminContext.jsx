import { createContext, useState, useEffect } from "react";
import API from "../adminapi"; // ✅ central API instance

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await API.get("/admin/me"); // ✅ use configured API instance
        setAdmin(res.data);
      } catch (error) {
        console.error("Failed to fetch admin:", error.message);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  return (
    <AdminContext.Provider value={{ admin, setAdmin, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
