import { useEffect, useState } from "react";
import axios from "axios";

function ManageStaff() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("https://nmt-mobile-backend.onrender.com/api/admin/users", {
        headers: { Authorization: token },
      })
      .then((res) => {
        console.log(res.data); // 👈 thêm dòng này
        setUsers(res.data)})
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>Danh sách nhân viên</h2>

      <table border={1} cellPadding={10}>
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
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageStaff;