import "./AboutPage.css";
import { useEffect, useState } from "react";
import axios from "axios";

function AboutPage() {

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    axios
      .get("https://nmt-mobile-backend.onrender.com/api/settings")
      .then((res) => setSettings(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!settings) return null;

  return (
    <div className="about-container">
      <div className="about-overlay">
        <div className="about-card">

          <h2>Thông tin cửa hàng</h2>

          <div className="about-item">
            <span>📍 Địa chỉ:</span>
            <p>{settings.address}</p>
            <div dangerouslySetInnerHTML={{ __html: settings.google_map }}/>
          </div>
          <div className="about-item">
            <div dangerouslySetInnerHTML={{ __html: settings.google_map }}/>
          </div>
          

          <div className="about-item">
            <span>📞 SĐT:</span>
            <p>{settings.phone}</p>
          </div>

          <div className="about-item">
            <span>📧 Email:</span>
            <p>{settings.email}</p>
          </div>

          <div className="about-item">
            <span>🛠 Dịch vụ:</span>
            <p>{settings.description}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AboutPage;