import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./BookingPage.css";

// 👉 Hàm lấy ngày giờ hiện tại đúng format cho datetime-local
const getCurrentDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};


function BookingPage() {
  const [formData, setFormData] = useState({
    customer_name: "",
    phone_number: "",
    email:"",
    device_model: "",
    repair_issue: "",
    appointment_date: getCurrentDateTime(),
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleSendOTP = async () => {
  if (!formData.email) {
    alert("Vui lòng nhập email trước");
    return;
  }

  try {
    setLoading(true);

    await axios.post(
      "https://nmt-mobile-backend.onrender.com/api/send-booking-otp",
      { email: formData.email }
    );

    alert("Mã OTP đã gửi về email");
    setShowOtpInput(true);
    setCountdown(60);
  } catch (error) {
    alert("Không gửi được OTP");
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  if (countdown === 0) return;

  const timer = setInterval(() => {
    setCountdown((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [countdown]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleVerifyOTP = async () => {
  try {
    await axios.post(
      "https://nmt-mobile-backend.onrender.com/api/verify-booking-otp",
      {
        email: formData.email,
        otp,
      }
    );

    alert("Xác thực thành công!");
    setIsVerified(true);
  } catch (error) {
    alert("OTP không đúng");
  }
};
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!isVerified) {
    alert("Bạn cần xác thực email trước khi đặt lịch");
    return;
  }

  try {
    await axios.post(
      "https://nmt-mobile-backend.onrender.com/api/bookings",
      formData
    );

    alert("Đặt lịch thành công!");

    // 🔥 RESET FORM
    setFormData({
      customer_name: "",
      phone_number: "",
      email: "",
      device_model: "",
      repair_issue: "",
      appointment_date: getCurrentDateTime(),
    });

    // 🔥 RESET OTP STATE
    setIsVerified(false);
    setShowOtpInput(false);
    setOtp("");
    setCountdown(0);

  } catch (error) {
    alert("Lỗi khi đặt lịch!");
  }
};
  return (
    <div className="booking-wrapper">
      <div className="booking-card">
        <h2>Đặt lịch sửa chữa</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên khách hàng</label>
            <input
              name="customer_name"
              value={formData.customer_name}
              placeholder="Nhập tên của bạn"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              name="phone_number"
              value={formData.phone_number}
              placeholder="Nhập số điện thoại"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              placeholder="Nhập email"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <button
            type="button"
          className="primary-button"
          onClick={handleSendOTP}
          disabled={countdown > 0 || loading}
        >
          {loading
            ? "Đang gửi mã..."
            : countdown > 0
            ? `Gửi lại sau ${countdown}s`
            : "Lấy mã xác nhận"}
        </button>
      
      {showOtpInput && (
        <div className="input-group">
          <input
            className="input"
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="button"
            className="success-button"
            onClick={handleVerifyOTP}
          >
            Xác nhận
          </button>
          
        </div>
      )}
          </div>

          <div className="form-group">
            <label>Dòng máy</label>
            <input
              name="device_model"
              value={formData.device_model}
              placeholder="Ví dụ: iPhone 13"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mô tả yêu cầu</label>
            <textarea
              name="repair_issue"
              value={formData.repair_issue}
              placeholder="Mô tả tình trạng máy"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Ngày hẹn</label>
            <input
              type="datetime-local"
              name="appointment_date"
              value={formData.appointment_date}  // ✅ thêm value
              min={getCurrentDateTime()}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={!isVerified}
          >
            {isVerified ? "Xác nhận đặt lịch" : "Chưa xác thực email"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;