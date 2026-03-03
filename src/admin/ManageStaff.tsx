import { useEffect, useState } from "react";
import axios from "axios";
import "./ManageStaff.css";
function ManageStaff() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`https://nmt-mobile-backend.onrender.com/api/admin/users`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        console.log(res.data); // 👈 thêm dòng này
        setUsers(res.data)})
      .catch((err) => console.log(err));
  }, []);

 return (
  <div className="manage-wrapper">
    <div className="manage-container">
      <h2 className="page-title">Danh sách nhân viên</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Tên</th>
              <th>SĐT</th>
              <th>Vai trò</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.full_name}</td>
                <td>{user.phone_number}</td>
                <td>
                  <span
                    className={
                      user.role === "admin"
                        ? "role-admin"
                        : "role-staff"
                    }
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}

export default ManageStaff;