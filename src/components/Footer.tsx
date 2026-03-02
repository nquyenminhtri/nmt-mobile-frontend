import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h3>NMTri Repair</h3>
          <p>Chuyên sửa chữa điện thoại uy tín - chuyên nghiệp.</p>
        </div>

        <div className="footer-col">
          <h4>Liên hệ</h4>
          <p>📍 Ấp 10, Xã Mỹ Lệ, Tỉnh Tây Ninh</p>
          <p>📞 0396369573</p>
          <p>🕒 8:00 - 21:00</p>
        </div>

        <div className="footer-col">
          <h4>Menu</h4>
          <Link to="/">Trang chủ</Link>
          <Link to="/booking">Đặt lịch</Link>
          <Link to="/history">Lịch sử</Link>
          <Link to="/about">Thông tin</Link>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Bản quyền thuộc NMTri Repair.
      </div>
    </footer>
  );
}

export default Footer;