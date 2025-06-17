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

// Decodifica el token y verifica expiración
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    // exp está en segundos desde epoch
    return Date.now() / 1000 > payload.exp;
  } catch {
    return true;
  }
}

export function PrivateRoute({ children }) {
  const token = getAuthToken();
  const roleId = getUserRole();
  const role = mapRole(roleId);
  const location = useLocation();
  const path = location.pathname;

  if (!token || isTokenExpired(token)) {
    // Limpia el token si está expirado
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
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
