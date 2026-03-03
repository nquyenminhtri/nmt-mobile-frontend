import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">

          <h2 className="logo">NMT Fix</h2>

          {/* Desktop Menu */}
          <div className="menu-desktop">
            <NavLink to="/" end>
              Trang chủ
            </NavLink>
            <NavLink to="/booking">
              Đặt lịch
            </NavLink>
            <NavLink to="/history">
              Lịch sử
            </NavLink>
            <NavLink to="/about">
              Thông tin
            </NavLink>
          </div>

          {/* Hamburger */}
          <div
            className="hamburger"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </div>
        </div>
      </nav>

      {/* Mobile Slide Menu */}
      <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
        <NavLink to="/" end onClick={closeMenu}>
          Trang chủ
        </NavLink>
        <NavLink to="/booking" onClick={closeMenu}>
          Đặt lịch
        </NavLink>
        <NavLink to="/history" onClick={closeMenu}>
          Lịch sử
        </NavLink>
        <NavLink to="/about" onClick={closeMenu}>
          Thông tin
        </NavLink>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="overlay" onClick={closeMenu}></div>
      )}
    </>
  );
}

export default Navbar;