import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import AboutPage from "./pages/AboutPage";
import HistoryPage from "./pages/HistoryPage";
import Footer from "./components/Footer";
import ContactFloat from "./components/ContactFloat";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import ManageBookings from "./admin/ManageBookings";
import ManageStaff from "./admin/ManageStaff";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="bookings" element={<ManageBookings />} />
  <Route path="staff" element={<ManageStaff />} />
</Route>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
      <ContactFloat />
    </BrowserRouter>
  );
}

export default App;