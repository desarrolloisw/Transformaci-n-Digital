/**
 * ReturnBtn component
 *
 * Renders a styled button for navigation, typically used to return to a previous page.
 *
 * Props:
 *   - to: (string) The route to navigate to (default: '/')
 *   - className: (string) Additional CSS classes for the button
 */

import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";

export const ReturnBtn = ({ to = "/", className = "" }) => {
  return (
    <Link
      to={to}
      className={`flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:scale-105 transition-all font-semibold gap-2 ${className}`}
    >
      <HiArrowLeft className="w-5 h-5" />
      Volver
    </Link>
  );
};