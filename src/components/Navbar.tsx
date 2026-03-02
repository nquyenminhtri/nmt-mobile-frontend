import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-top">
        <h2 className="logo">NMT Mobile</h2>

        <div
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </div>
      </div>

      <div className={`menu ${isOpen ? "active" : ""}`}>
        <NavLink to="/" end onClick={() => setIsOpen(false)}>
          Trang chủ
        </NavLink>
        <NavLink to="/booking" onClick={() => setIsOpen(false)}>
          Đặt lịch
        </NavLink>
        <NavLink to="/history" onClick={() => setIsOpen(false)}>
          Lịch sử
        </NavLink>
        <NavLink to="/about" onClick={() => setIsOpen(false)}>
          Thông tin
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;