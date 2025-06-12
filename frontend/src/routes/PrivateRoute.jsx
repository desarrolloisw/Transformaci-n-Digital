import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken, getUserRole } from "../api/auth.api";

// Rutas permitidas por rol
const roleAccess = {
  PAT: [
    /^\/$/,
    /^\/dashboard\/(processes|categories|categoriesbyprocess)$/,
    /^\/chatbot-config(\/processes|\/categories)?$/,
    /^\/process\/\d+$/,
    /^\/category\/\d+$/,
    /^\/users$/,
    /^\/user\/\d+$/,
  ],
  COORD: [
    /^\/$/,
    /^\/dashboard\/(processes|categories|categoriesbyprocess)$/,
  ],
};

// Mapear el userTypeId a nombre de rol
function mapRole(roleId) {
  if (roleId === "1") return "PAT";
  if (roleId === "2") return "COORD";
  return null;
}

export function PrivateRoute({ children }) {
  const token = getAuthToken();
  const roleId = getUserRole();
  const role = mapRole(roleId);
  const location = useLocation();
  const path = location.pathname;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  const allowed = (roleAccess[role] || []).some((regex) => regex.test(path));
  if (!allowed) {
    if (role === "COORD") return <Navigate to="/dashboard/processes" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
