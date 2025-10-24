import React from "react";
import "./Users.css";

const Users = () => {
  const users = [
    { id: 1, name: "John Doe", role: "User", email: "john@example.com" },
    { id: 2, name: "Alice Smith", role: "Researcher", email: "alice@example.com" },
    { id: 3, name: "Bob Admin", role: "Admin", email: "bob@example.com" },
  ];

  return (
    <div className="users-page">
      <h1 className="page-title">Manage Users</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
