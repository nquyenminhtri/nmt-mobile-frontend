import banner from "../assets/banner.png";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <img src={banner} alt="NMT Fix" className="hero-img" />

      <div className="hero-overlay">
        <h1>NMT FIX</h1>
        <p>Dịch vụ sửa chữa điện tử chuyên nghiệp tại Tây Ninh</p>

        <button
          className="hero-btn"
          onClick={() => navigate("/booking")}
        >
          Đặt lịch ngay
        </button>
      </div>
    </div>
  );
}

export default HomePage;