import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Nếu chưa đăng nhập
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu không phải admin
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;