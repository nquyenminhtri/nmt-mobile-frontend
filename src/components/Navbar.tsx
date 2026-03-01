
import "./Navbar.css";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">NMT Mobile</h2>
      <div className="menu">
        <NavLink to="/" end>Trang chủ</NavLink>
        <NavLink to="/booking">Đặt lịch</NavLink>
        <NavLink to="/history">Lịch sử</NavLink>
        <NavLink to="/about">Thông tin</NavLink>

      </div>
    </nav>
  );
}

export default Navbar;