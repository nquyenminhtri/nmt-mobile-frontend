import { useState } from "react";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await axios.post("http://nmt-mobile-backend/api/bookings", formData);
      alert("Đặt lịch thành công!");
    } catch (error) {
      console.error(error);
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
              placeholder="Nhập tên của bạn"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              name="phone_number"
              placeholder="Nhập số điện thoại"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              placeholder="Nhập email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Dòng máy</label>
            <input
              name="device_model"
              placeholder="Ví dụ: iPhone 13"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mô tả yêu cầu</label>
            <textarea
              name="repair_issue"
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
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Xác nhận đặt lịch
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;