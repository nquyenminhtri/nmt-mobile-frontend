import { useState ,useEffect} from "react";
import axios from "axios";
import "./HistoryPage.css";
function HistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

const handleSendOTP = async () => {
  if (!contact) {
    alert("Vui lòng nhập số điện thoại hoặc email");
    return;
  }

  try {
    setLoading(true);

    await axios.post(
      "https://nmt-mobile-backend.onrender.com/api/send-otp",
      { contact }
    );

    setShowOtpInput(true);
    setCountdown(60);
  } catch (error: any) {
    if (error.response?.status === 404) {
      alert("Không tìm thấy thông tin");
    } else {
      alert("Lỗi hệ thống, vui lòng thử lại sau");
    }
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
}, [countdown])

const handleVerifyOTP = async () => {
  if (!otp) {
    alert("Nhập mã OTP");
    return;
  }

  try {
    const res = await axios.post(
      "https://nmt-mobile-backend.onrender.com/api/verify-otp",
      { contact, otp }
    );

    setBookings(res.data);
    setIsVerified(true);
  } catch (error) {
    alert("OTP không đúng");
  }
};
// hành động chức năng hủy
const handleCancel = async (id: number) => {
  const confirmCancel = window.confirm("Bạn có chắc muốn huỷ lịch này?");
  if (!confirmCancel) return;

  try {
    await axios.put("https://nmt-mobile-backend.onrender.com/api/cancel-booking/${id}");

    // cập nhật lại UI
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "Đã Hủy" } : b
      )
    );
  } catch (error) {
    alert("Không thể huỷ lịch");
  }
};
const filteredBookings = bookings
  .filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter)
      return false;

    if (fromDate && new Date(b.appointment_date) < new Date(fromDate))
      return false;

    if (toDate && new Date(b.appointment_date) > new Date(toDate))
      return false;

    return true;
  })
  .sort((a, b) => {
    if (sortOrder === "asc") {
      return (
        new Date(a.appointment_date).getTime() -
        new Date(b.appointment_date).getTime()
      );
    } else {
      return (
        new Date(b.appointment_date).getTime() -
        new Date(a.appointment_date).getTime()
      );
    }
  });
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedBookings = filteredBookings.slice(
  startIndex,
  startIndex + itemsPerPage
);
const getStatusClass = (status: string) => {
  switch (status) {
    case "Chờ Xác Nhận":
      return "status-pending";
    case "Đang Sửa":
      return "status-repairing";
    case "Hoàn Thành":
      return "status-completed";
    default:
      return "";
  }
};
 return (
  <div className="page">
    {isVerified && (
  <div className="filter-bar">
    <select onChange={(e) => setSortOrder(e.target.value)}>
      <option value="desc">Mới nhất</option>
      <option value="asc">Cũ nhất</option>
    </select>

    <select onChange={(e) => setStatusFilter(e.target.value)}>
      <option value="all">Tất cả trạng thái</option>
      <option value="Chờ Xác Nhận">Chờ xác nhận</option>
      <option value="Đang Sửa">Đã xác nhận</option>
      <option value="Hoàn Thành">Hoàn thành</option>
      <option value="Đã Hủy">Đã huỷ</option>
    </select>

    <input
      type="date"
      onChange={(e) => setFromDate(e.target.value)}
    />

    <input
      type="date"
      onChange={(e) => setToDate(e.target.value)}
    />
  </div>
)}
    {!isVerified && (
        
    <div className="card">
      <h2 className="title">Tra cứu lịch sửa chữa</h2>

      <div className="input-group">
        <input
          className="input"
          placeholder="Nhập số điện thoại hoặc email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <button
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
      </div>

      {showOtpInput && (
        <div className="input-group">
          <input
            className="input"
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="success-button" onClick={handleVerifyOTP}>
            Xác nhận
          </button>
          
        </div>
      )}
    </div>
    )}

    {bookings.length > 0 && (
      <div className="result-container">
        {paginatedBookings.map((b) => (
          <div key={b.id} className="booking-card">
            <div className="row">
             <span className={`status ${getStatusClass(b.status)}`}>
                {b.status}
              </span>
            </div>
            <p><strong>Tên:</strong> {b.customer_name}</p>

            <p><strong>SĐT:</strong> {b.phone_number}</p>
            <p><strong>Email:</strong> {b.email}</p>
            <p><strong>Thiết bị:</strong> {b.device_model}</p>
            <p><strong>Lỗi:</strong> {b.repair_issue}</p>
            <p><strong>Ngày hẹn:</strong> {b.appointment_date}</p>
            
            <p>
            <strong>Báo giá:</strong>{" "}
            {b.repair_price
                ? `${Number(b.repair_price).toLocaleString()} đ`
                : "Chờ báo giá"}
            </p>

            {b.admin_note && (
            <p>
                <strong>Ghi chú:</strong> {b.admin_note}
            </p>
            )}
            {b.status !== "completed" && b.status !== "Đã Hủy" && (
            <button
                className="cancel-btn"
                onClick={() => handleCancel(b.id)}
            >
                Huỷ lịch
            </button>
            )}
          </div>
          
        ))}
      </div>
    )}
    {totalPages > 1 && (
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
    >
      ← Trước
    </button>

    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        className={currentPage === index + 1 ? "active-page" : ""}
        onClick={() => setCurrentPage(index + 1)}
      >
        {index + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((prev) => prev + 1)}
    >
      Sau →
    </button>
  </div>
)}
  </div>
);
}

export default HistoryPage;