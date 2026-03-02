import { NavLink, Outlet } from "react-router-dom";
import { FaBell, FaBars } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminLayout.css";

function AdminLayout() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

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
    <div className="admin-wrapper">

      {/* ===== TOP NAVBAR ===== */}
      <div className="admin-navbar">

        {/* LEFT */}
        <div className="left-section">
          <button
            className="menu-btn"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <FaBars />
          </button>
          <h2>NMT Admin</h2>
        </div>

        {/* RIGHT */}
        <div className="right-section">

          <div
            className="notification"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaBell size={18} />

            {notifications.length > 0 && (
              <span className="badge">
                {notifications.length}
              </span>
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
      </div>

      {/* ===== MOBILE MENU ===== */}
      <div className={`mobile-menu ${openMenu ? "active" : ""}`}>
        <NavLink to="/admin" end onClick={() => setOpenMenu(false)}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/bookings" onClick={() => setOpenMenu(false)}>
          Quản lý đơn
        </NavLink>

        <NavLink to="/admin/staff" onClick={() => setOpenMenu(false)}>
          Nhân viên
        </NavLink>

        <button className="logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>

      {/* Overlay */}
      {openMenu && (
        <div className="overlay" onClick={() => setOpenMenu(false)} />
      )}

      {/* ===== CONTENT ===== */}
      <div className="admin-content">
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;