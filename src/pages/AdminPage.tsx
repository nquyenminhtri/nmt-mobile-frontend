import { useEffect } from "react";

function AdminPage() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return <h2>Trang quản lý</h2>;
}

export default AdminPage;