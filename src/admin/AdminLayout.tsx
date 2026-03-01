import { NavLink, Outlet } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminLayout.css";

function AdminLayout() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "https://nmt-mobile-backend.onrender.com/api/admin/new-bookings"
      );
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>NMT Admin</h2>
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/bookings">Quản lý đơn</NavLink>
        <NavLink to="/admin/staff">Nhân viên</NavLink>
        <button className="logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>

      {/* Main content */}
      <div className="main">
        <div className="admin-topbar">
          <div
            className="notification"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaBell size={18} />
            {notifications.length > 0 && (
              <span className="badge">{notifications.length}</span>
            )}

            {showDropdown && (
              <div className="dropdown">
                {notifications.length === 0 ? (
                  <p>Không có đơn mới</p>
                ) : (
                  notifications.map((item) => (
                    <div key={item.id} className="dropdown-item">
                      Đơn #{item.id} - {item.customer_name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;