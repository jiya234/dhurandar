import { useState } from "react";
import "./Users.css";

const Users = () => {
  const [users] = useState([
    {
      id: 1,
      name: "Ravi Kumar",
      role: "Farmer",
      email: "ravi@gmail.com"
    },
    {
      id: 2,
      name: "Anjali Sharma",
      role: "Researcher",
      email: "anjali@nit.edu"
    },
    {
      id: 3,
      name: "Admin",
      role: "Admin",
      email: "admin@agrismart.ai"
    }
  ]);


  return (
    <div className="users-page">

      <h1>Manage Users</h1>

      {/* 🟢 REGISTERED USERS */}
      <div className="section">
        <h2>Registered Users</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>
                  <span className={`role ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
</div>
  );
};

export default Users;
