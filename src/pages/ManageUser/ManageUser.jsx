import React, { useEffect, useState } from "react";
import API from "../../adminapi"; // ✅ Use centralized axios instance
import "./ManageUser.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState("");

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/admin/users");
      setUsers(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
      setError(err.response?.data?.message || "❌ Failed to load users");
    }
  };

  // ✅ Delete user by ID
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/api/admin/users/${userId}`);
      const updatedUsers = users.filter((u) => u._id !== userId);
      setUsers(updatedUsers);
      setFiltered(updatedUsers);
    } catch (err) {
      console.error("❌ Delete failed:", err);
      setError(err.response?.data?.message || "❌ Failed to delete user");
    }
  };

  // ✅ Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Real-time search
  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.fullName?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s)
      )
    );
  }, [search, users]);

  return (
    <div className="manage-users">
      <h2>👥 Manage Users</h2>

      {error && <p className="error-msg">{error}</p>}

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone || "—"}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
