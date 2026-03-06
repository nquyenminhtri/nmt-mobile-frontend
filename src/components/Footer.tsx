import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Footer.css";

function Footer() {

  const [settings, setSettings] = useState<any>({
    site_name: "",
    phone: "",
    address: "",
    working_hours: ""
  });

  useEffect(() => {

    const fetchSettings = async () => {
      try {

        const res = await axios.get(
          "https://nmt-mobile-backend.onrender.com/api/settings"
        );

        setSettings(res.data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchSettings();

  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-col">
          <h3>{settings.site_name}</h3>
          <p>Chuyên sửa chữa điện thoại uy tín - chuyên nghiệp.</p>
        </div>

        <div className="footer-col">
          <h4>Liên hệ</h4>
          <p>📍 {settings.address}</p>
          <p>📞 {settings.phone}</p>
          <p>🕒 {settings.working_hours}</p>
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
        © {new Date().getFullYear()} Bản quyền thuộc {settings.site_name}.
      </div>
    </footer>
  );
}

export default Footer;