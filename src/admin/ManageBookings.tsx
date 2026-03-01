import { useEffect, useState } from "react";
import axios from "axios";
import "./ManageBookings.css";

function ManageBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [priceInput, setPriceInput] = useState<{ [key: number]: string }>({});
  const [noteInput, setNoteInput] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // desc = mới nhất
  const processedBookings = bookings
  // 🔎 Tìm kiếm theo tên hoặc SĐT
  .filter((b) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      b.customer_name.toLowerCase().includes(lowerSearch) ||
      b.phone_number.includes(lowerSearch)
    );
  })
   // 📅 Lọc theo khoảng ngày
  .filter((b) => {
    const bookingDate = new Date(b.appointment_date).getTime();

    if (startDate && bookingDate < new Date(startDate).getTime())
      return false;

    if (endDate && bookingDate > new Date(endDate).getTime())
      return false;

    return true;
  })
  // LỌC
  .filter((b) => {
    if (filterStatus === "all") return true;
    return b.status === filterStatus;
  })
  // SẮP XẾP
  .sort((a, b) => {
    const dateA = new Date(a.appointment_date).getTime();
    const dateB = new Date(b.appointment_date).getTime();

    return sortOrder === "desc"
      ? dateB - dateA
      : dateA - dateB;
  });
  const totalPages = Math.ceil(processedBookings.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = processedBookings.slice(
  startIndex,
  startIndex + itemsPerPage
);
//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     axios
//       .get("http://localhost:5000/api/admin/bookings", {
//         headers: { Authorization: token },
//       })
//       .then((res) => setBookings(res.data))
//       .catch((err) => console.log(err));
//   }, []);

useEffect(() => {
  const token = localStorage.getItem("token");

  axios
    .get("http://localhost:5000/api/admin/bookings", {
      headers: { Authorization: token },
    })
    .then((res) => {
      console.log(res.data); // 👈 thêm dòng này
      setBookings(res.data);
    })
    .catch((err) => console.log(err));
}, []);
const handleQuote = async (id: number) => {
  const price = priceInput[id];

  // ❗ Bắt buộc nhập giá
  if (!price || Number(price) <= 0) {
    alert("Vui lòng nhập giá sửa chữa hợp lệ");
    return;
  }

  try {
    await axios.put(
      `http://localhost:5000/api/bookings/${id}/quote`,
      {
        repair_price: price,
        admin_note: noteInput[id],
      }
    );

    alert("Cập nhật báo giá thành công");

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, repair_price: price, status: "Đang Sửa" }
          : b
      )
    );
  } catch (error) {
    alert("Lỗi cập nhật báo giá");
  }
};
const handleComplete = async (id: number) => {
  const confirmDone = window.confirm("Xác nhận đã sửa xong?");
  if (!confirmDone) return;

  try {
    await axios.put(
      `http://localhost:5000/api/bookings/${id}/complete`
    );

    alert("Đã hoàn thành đơn");

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "Hoàn Thành" } : b
      )
    );
  } catch (error) {
    alert("Lỗi cập nhật trạng thái");
  }
};

  return (
    <div>
      <h2>Lịch sử đặt lịch</h2>
      <div className="filter-bar">
        {/* 🔎 Tìm kiếm */}
        <input
            type="text"
            placeholder="Tìm theo tên hoặc SĐT"
            value={searchTerm}
            onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
            }}
        />

        {/* 📅 Từ ngày */}
        <input
            type="date"
            value={startDate}
            onChange={(e) => {
            setStartDate(e.target.value);
            setCurrentPage(1);
            }}
        />

        {/* 📅 Đến ngày */}
        <input
            type="date"
            value={endDate}
            onChange={(e) => {
            setEndDate(e.target.value);
            setCurrentPage(1);
            }}
        />

        {/* 📌 Trạng thái */}
        <select
            value={filterStatus}
            onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
            }}
        >
            <option value="all">Tất cả</option>
            <option value="Chờ Xác Nhận">Chờ Xác Nhận</option>
            <option value="Đang sửa">Đang sửa</option>
            <option value="Hoàn Thành">Hoàn Thành</option>
            <option value="Đã hủy">Đã hủy</option>
        </select>

        <select
            value={filterStatus}
            onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
            }}
        >
            <option value="all">Tất cả</option>
            <option value="Chờ Xác Nhận">Chờ Xác Nhận</option>
            <option value="Đang Sửa">Đang Sửa</option>
            <option value="Hoàn Thành">Hoàn Thành</option>
            <option value="Đã Hủy">Đã Hủy</option>
        </select>

        <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
        >
            <option value="desc">Mới nhất</option>
            <option value="asc">Cũ nhất</option>
        </select>
        </div>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên khách</th>
            <th>SĐT</th>
            <th>Thiết bị</th>
            <th>Mô tả</th>
            <th>Giá sửa</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Ghi chú của thợ</th>
          </tr>
        </thead>

        <tbody>
          {paginatedBookings.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.customer_name}</td>
              <td>{b.phone_number}</td>
              <td>{b.device_model}</td>
              <td>{b.repair_issue}</td>
              <td>{new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(b.repair_price)}</td>
              
              <td>{new Date(b.appointment_date)
  .toLocaleDateString("vi-VN")
  .replace(/\//g, "-")}</td>
              <td>{b.status}</td>
              <td>{b.admin_note}</td>
              <td>
                {(b.status === "Chờ Xác Nhận") && (
                <div className="quote-box">
                    <input
                    type="number"
                    placeholder="Nhập giá sửa chữa"
                    value={priceInput[b.id] || ""}
                    onChange={(e) =>
                        setPriceInput({
                        ...priceInput,
                        [b.id]: e.target.value,
                        })
                    }
                    />

                    <textarea
                    placeholder="Ghi chú kỹ thuật"
                    value={noteInput[b.id] || ""}
                    onChange={(e) =>
                        setNoteInput({
                        ...noteInput,
                        [b.id]: e.target.value,
                        })
                    }
                    />

                    <button 
                     disabled={!priceInput[b.id] || Number(priceInput[b.id]) <= 0}
                    onClick={() => handleQuote(b.id)}>
                    Gửi báo giá và nhận máy
                    </button>
                </div>
                )}
              {b.status === "Đang Sửa" && (
                    <button
                    className="complete-btn"
                    onClick={() => handleComplete(b.id)}
                    >
                    Xác Nhận Hoàn Thành
                    </button>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
        >
            ←
        </button>

        <span>
            Trang {currentPage} / {totalPages}
        </span>

        <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
        >
            →
        </button>
        </div>
    </div>
  );
}


export default ManageBookings;