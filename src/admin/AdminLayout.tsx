import { NavLink, Outlet } from "react-router-dom";
import { FaBell, FaBars } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminLayout.css";

function AdminLayout() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleSubMenu = (menu: string) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `https://nmt-mobile-backend.onrender.com/api/admin/new-bookings`
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

        {/* ===== QUẢN LÝ ĐƠN ===== */}
        <div className="menu-parent" onClick={() => toggleSubMenu("orders")}>
          Quản lý đơn
          <span className={`arrow ${openSubMenu === "orders" ? "rotate" : ""}`}>▼</span>
        </div>

        {openSubMenu === "orders" && (
          <div className="submenu">
            <NavLink to="/admin/bookings" onClick={() => setOpenMenu(false)}>
              Đơn sửa chữa
            </NavLink>
            <NavLink to="/admin/appointments" onClick={() => setOpenMenu(false)}>
              Đặt lịch
            </NavLink>
            <NavLink to="/admin/completed-orders" onClick={() => setOpenMenu(false)}>
              Đơn hoàn thành
            </NavLink>
            <NavLink to="/admin/cancelled-orders" onClick={() => setOpenMenu(false)}>
              Đơn đã hủy
            </NavLink>
          </div>
        )}

        {/* ===== NHÂN VIÊN ===== */}
        <div className="menu-parent" onClick={() => toggleSubMenu("staff")}>
          Quản lý nhân viên
          <span className={`arrow ${openSubMenu === "staff" ? "rotate" : ""}`}>▼</span>
        </div>

        {openSubMenu === "staff" && (
          <div className="submenu">
            <NavLink to="/admin/staff">Danh sách nhân viên</NavLink>
            <NavLink to="/admin/role">Phân quyền</NavLink>
            <NavLink to="/admin/performance">Hiệu suất làm việc</NavLink>
          </div>
        )}

        {/* ===== KHÁCH HÀNG ===== */}
        <div className="menu-parent" onClick={() => toggleSubMenu("customer")}>
          Quản lý khách hàng
          <span className={`arrow ${openSubMenu === "customer" ? "rotate" : ""}`}>▼</span>
        </div>

        {openSubMenu === "customer" && (
          <div className="submenu">
            <NavLink to="/admin/customer">Danh sách khách</NavLink>
            <NavLink to="/admin/vip-customer">Khách VIP</NavLink>
          </div>
        )}

        {/* ===== HÀNG HÓA ===== */}
        <div className="menu-parent" onClick={() => toggleSubMenu("product")}>
          Quản lý hàng hóa
          <span className={`arrow ${openSubMenu === "product" ? "rotate" : ""}`}>▼</span>
        </div>

        {openSubMenu === "product" && (
          <div className="submenu">
            <NavLink to="/admin/product">Sản phẩm</NavLink>
            <NavLink to="/admin/category">Loại sản phẩm</NavLink>
            <NavLink to="/admin/inventory">Tồn kho</NavLink>
            <NavLink to="/admin/stock-audit">Kiểm kê kho</NavLink>
          </div>
        )}

        {/* ===== NHẬP HÀNG ===== */}
        <div className="menu-parent" onClick={() => toggleSubMenu("import")}>
          Nhập hàng
          <span className={`arrow ${openSubMenu === "import" ? "rotate" : ""}`}>▼</span>
        </div>

        {openSubMenu === "import" && (
          <div className="submenu">
            <NavLink to="/admin/import-product">Tạo phiếu nhập</NavLink>
            <NavLink to="/admin/import-history">Lịch sử nhập</NavLink>
            <NavLink to="/admin/supplier">Nhà cung cấp</NavLink>
          </div>
        )}
        {/* ===== THIẾT BỊ ===== */}
        <div className="menu-parent" onClick={() => toggleSubMenu("device")}>
          Quản lý thiết bị
          <span className={`arrow ${openSubMenu === "device" ? "rotate" : ""}`}>▼</span>
        </div>

        {openSubMenu === "device" && (
          <div className="submenu">
            <NavLink to="/admin/device">Thiết bị</NavLink>
            <NavLink to="/admin/device/category">Loại thiết bị</NavLink>
          </div>
        )}

        {/* ===== THỐNG KÊ ===== */}
        <div className="menu-parent" onClick={() => toggleSubMenu("report")}>
          Thống kê
          <span className={`arrow ${openSubMenu === "report" ? "rotate" : ""}`}>▼</span>
        </div>

        {openSubMenu === "report" && (
          <div className="submenu">
            <NavLink to="/admin/revenue-statistics">Doanh thu</NavLink>
            <NavLink to="/admin/top-services">Top dịch vụ</NavLink>
            <NavLink to="/admin/top-customers">Top khách hàng</NavLink>
          </div>
        )}

        {/* ===== CẤU HÌNH ===== */}
        <NavLink to="/admin/settings" onClick={() => setOpenMenu(false)}>
          Cấu hình hệ thống
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