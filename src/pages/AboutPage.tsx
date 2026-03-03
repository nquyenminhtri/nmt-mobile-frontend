import banner from "../assets/banner.png";
import "./AboutPage.css";

function AboutPage() {
  return (
    <div
      className="about-container"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="about-overlay">
        <div className="about-card">
          <h2>Thông tin cửa hàng</h2>

          <div className="about-item">
            <span>📍 Địa chỉ:</span>
            <p>Ấp 10, Mỹ Lệ, Tây Ninh</p>
          </div>

          <div className="about-item">
            <span>📞 SĐT:</span>
            <p>0369 396 573</p>
          </div>

          <div className="about-item">
            <span>🛠 Dịch vụ:</span>
            <p>Kinh doanh và sửa chữa các loại điện thoại và thiết bị điện tử</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;