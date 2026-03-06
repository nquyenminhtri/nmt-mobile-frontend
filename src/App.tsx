import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ContactFloat from "./components/ContactFloat";

import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import AboutPage from "./pages/AboutPage";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";

import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import ManageBookings from "./admin/ManageBookings";
import ManageStaff from "./admin/ManageStaff";
import ProtectedRoute from "./ProtectedRoute";

import SettingsPage from "./admin/SettingsPage";

import PublicLayout from "./layouts/PublicLayout";

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}

      <Routes>
        {/* ADMIN */}
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

        {/* CUSTOMER */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/booking"
          element={
            <PublicLayout>
              <BookingPage />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          }
        />
        <Route
          path="/history"
          element={
            <PublicLayout>
              <HistoryPage />
            </PublicLayout>
          }
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      {!isAdmin && <Footer />}
      {!isAdmin && <ContactFloat />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;