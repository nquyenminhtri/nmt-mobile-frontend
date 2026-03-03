import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, revenueRes, statusRes] = await Promise.all([
          axios.get(`https://nmt-mobile-backend.onrender.com/api/admin/dashboard`),
          axios.get(`https://nmt-mobile-backend.onrender.com/api/admin/revenue-7days`),
          axios.get(`https://nmt-mobile-backend.onrender.com/api/admin/status-summary`),
        ]);

        setDashboard(dashRes.data);
        setRevenueData(revenueRes.data);
        setStatusData(statusRes.data);
      } catch (error) {
        console.error("Dashboard load error:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 📈 Line Chart
  const lineChartData = {
    labels: revenueData.map((item) => item.date),
    datasets: [
      {
        label: "Doanh thu 7 ngày",
        data: revenueData.map((item) => item.total),
        borderColor: "#2563eb",
        backgroundColor: "#3b82f6",
        tension: 0.4,
      },
    ],
  };

  // 🥧 Pie Chart
  const pieData = {
    labels: statusData.map((s) => s.status),
    datasets: [
      {
        data: statusData.map((s) => s.total),
        backgroundColor: [
          "#f59e0b",
          "#2563eb",
          "#16a34a",
          "#7c3aed",
          "#ef4444",
        ],
      },
    ],
  };

  return (
    <div className="dashboard-grid">
      <div className="card blue">
        <h4>Tổng đơn</h4>
        <p>{dashboard?.total ?? 0}</p>
      </div>

      <div className="card orange">
        <h4>Chờ xác nhận</h4>
        <p>{dashboard?.pending ?? 0}</p>
      </div>

      <div className="card purple">
        <h4>Đang sửa</h4>
        <p>{dashboard?.repairing ?? 0}</p>
      </div>

      <div className="card green">
        <h4>Doanh thu hôm nay</h4>
        <p>
          {new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
}).format(dashboard?.revenueToday ?? 0)}
        </p>
      </div>

      <div className="card dark">
        <h4>Doanh thu tháng</h4>
        <p>
          {new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
}).format(dashboard?.revenueMonth ?? 0)}
        </p>
      </div>

      <div className="chart-box">
        <Line
          data={lineChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            }
          }}
        />
      </div>

      <div className="chart-box">
        <Pie
          data={pieData}
          options={{
            responsive: true,
            maintainAspectRatio: false
          }}
        />
      </div>
    </div>
  );
}

export default Dashboard;