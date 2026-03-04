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
  const [devices, setDevices] = useState<any[]>([]);
  const [isCustomDevice, setIsCustomDevice] = useState(false);
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
    const fetchDeviceTypes = async () => {
      const res = await axios.get(
        "https://nmt-mobile-backend.onrender.com/api/device-types"
      );
      setDeviceTypes(res.data);
    };

    fetchDeviceTypes();
  }, []);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axios.get(
          "https://nmt-mobile-backend.onrender.com/api/devices"
        );
        setDevices(res.data);
      } catch (error) {
        console.error("Không tải được danh sách thiết bị");
      }
    };

    fetchDevices();
  }, []);
  const handleDeviceTypeChange = async (e:any) => {
  const typeId = e.target.value;

  const res = await axios.get(
    `https://nmt-mobile-backend.onrender.com/api/devices/${typeId}`
  );

  setDevices(res.data);
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

          <select onChange={handleDeviceTypeChange}>
          <option value="">Chọn loại thiết bị</option>

          {deviceTypes.map((type) => (
          <option key={type.id} value={type.id}>
          {type.name}
          </option>
          ))}

          </select>
          </div>
          <div className="form-group">
            <label>Dòng máy</label>

            <select
            onChange={(e)=>{
            if(e.target.value==="other"){
            setIsCustomDevice(true)
            }else{
            setIsCustomDevice(false)

            setFormData(prev=>({
            ...prev,
            device_model:e.target.value
            }))
            }
            }}
            >

            <option value="">Chọn thiết bị</option>

            {devices.map((d)=>(
            <option key={d.id} value={d.name}>
            {d.name}
            </option>
            ))}

            <option value="other">Khác (nhập tay)</option>

            </select>

            {isCustomDevice && (

            <input
            placeholder="Nhập dòng máy"
            value={formData.device_model}
            onChange={(e)=>setFormData(prev=>({
            ...prev,
            device_model:e.target.value
            }))}
            />

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