import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken, getUserRole } from "../api/auth.api";

/**
 * Allowed routes per user role. Each role maps to an array of regex patterns for allowed paths.
 */
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

/**
 * Maps a userTypeId to a role name string.
 * @param {string} roleId - The userTypeId from the token or storage.
 * @returns {string|null} - The role name or null if not found.
 */
function mapRole(roleId) {
  if (roleId === "1") return "PAT";
  if (roleId === "2") return "COORD";
  return null;
}

/**
 * Decodes a JWT token and checks if it is expired.
 * @param {string} token - The JWT token.
 * @returns {boolean} - True if expired or invalid, false otherwise.
 */
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    // exp is in seconds since epoch
    return Date.now() / 1000 > payload.exp;
  } catch {
    return true;
  }
}

/**
 * PrivateRoute component: Protects routes based on authentication and user role.
 * Redirects to login if not authenticated or token expired.
 * Redirects to allowed dashboard if user tries to access a forbidden route.
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - The protected content.
 */
export function PrivateRoute({ children }) {
  const token = getAuthToken();
  const roleId = getUserRole();
  const role = mapRole(roleId);
  const location = useLocation();
  const path = location.pathname;

  // If not authenticated or token expired, clear storage and redirect to login
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    return <Navigate to="/admin" replace />;
  }

  // If role is not recognized, redirect to login
  if (!role) {
    return <Navigate to="/admin" replace />;
  }

  // Check if the current path is allowed for the user's role
  const allowed = (roleAccess[role] || []).some((regex) => regex.test(path));
  if (!allowed) {
    if (role === "COORD") return <Navigate to="/dashboard/processes" replace />;
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected children
  return children;
}
