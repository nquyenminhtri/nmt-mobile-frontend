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
  
  
  
  const [deviceTypes, setDeviceTypes] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [deviceQuery, setDeviceQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
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
  const fetchTypes = async () => {
    const res = await axios.get(
      "https://nmt-mobile-backend.onrender.com/api/device-types"
    );

    setDeviceTypes(res.data);
  };

  fetchTypes();
}, []);
const handleDeviceSearch = async (value: string) => {
  setDeviceQuery(value);

  if (!selectedType) return;

  if (value.length < 2) {
    setSuggestions([]);
    return;
  }

  const res = await axios.get(
    `https://nmt-mobile-backend.onrender.com/api/devices/search`,
    {
      params: {
        q: value,
        typeId: selectedType,
      },
    }
  );

  setSuggestions(res.data);
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
  if (!formData.device_model || formData.device_model.trim() === "") {
    alert("Vui lòng chọn hoặc nhập dòng máy");
    return;
  }
  if (!isValidPhone(formData.phone_number)) {
    alert("Số điện thoại không hợp lệ");
    return;
  }

  if (!isValidEmail(formData.email)) {
    alert("Email không hợp lệ");
    return;
  }

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

    // Reset form
    setFormData({
      customer_name: "",
      phone_number: "",
      email: "",
      device_model: "",
      repair_issue: "",
      appointment_date: getCurrentDateTime(),
    });

    setIsVerified(false);
    setShowOtpInput(false);
    setOtp("");
    setCountdown(0);

  } catch (error) {
    alert("Lỗi khi đặt lịch!");
  }
};
const isValidPhone = (phone: string) => {
  return /^(0[0-9]{8,10})$/.test(phone);
};

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
              inputMode="numeric"
              pattern="[0-9]{9,11}"
              maxLength={11}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setFormData((prev) => ({
                  ...prev,
                  phone_number: onlyNumbers,
                }));
              }}
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
<label>Loại thiết bị</label>

<select
value={selectedType}
onChange={(e)=>setSelectedType(e.target.value)}
>

<option value="">Chọn loại thiết bị</option>

{deviceTypes.map(type=>(
<option key={type.id} value={type.id}>
{type.name}
</option>
))}

</select>
</div>
          <div className="form-group">
<label>Dòng máy</label>

<input
value={deviceQuery}
placeholder="Nhập dòng máy..."
onChange={(e)=>handleDeviceSearch(e.target.value)}
required
/>

{suggestions.length > 0 && (

<div className="suggestions">

{suggestions.map(device=>(
<div
key={device.id}
className="suggestion-item"
onClick={()=>{
setDeviceQuery(device.name)

setFormData(prev=>({
...prev,
device_model:device.name
}))

setSuggestions([])
}}
>
{device.name}
</div>
))}

</div>

)}

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