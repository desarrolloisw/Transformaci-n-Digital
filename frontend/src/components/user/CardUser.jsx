/**
 * CardUser component
 *
 * Displays a user profile card with avatar, name, status, creation date, and a link to user details.
 * Handles missing user data gracefully.
 *
 * Props:
 *   - user: Object containing user information (id, name, lastName, secondLastName, isActive, createdAt)
 */
import { Link } from "react-router-dom";
import DefaultUserImage from "../../assets/img/default_user.png";

export const CardUser = ({ user }) => {
  if (!user || !user.name) {
    return (
      <div className="flex items-center justify-center h-48 bg-red-50 rounded-lg shadow text-red-500 font-semibold">
        Usuario no encontrado
      </div>
    );
  }

  return (
    <div className="w-full h-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-blue-100 hover:shadow-2xl transition-shadow duration-200 min-w-0">
      <div className="w-full h-32 sm:h-40 flex items-center justify-center bg-gradient-to-b from-[#00478f]/80 to-blue-200">
        <img
          src={DefaultUserImage}
          alt={`${user.name} ${user.lastName || ""} ${user.secondLastName || ""}`}
          className="h-20 sm:h-28 object-contain drop-shadow-lg"
          draggable={false}
        />
      </div>
      <div className="flex-1 flex flex-col justify-between p-3 sm:p-4">
        <div>
          <h2
            className="text-base sm:text-xl font-bold text-[#00478f] mb-1 break-words max-w-full max-h-16 overflow-y-auto"
            title={`${user.name} ${user.lastName} ${user.secondLastName || ""}`}
            style={{ wordBreak: "break-word" }}
          >
            {user.name} {user.lastName} {user.secondLastName || ""}
          </h2>
          <span
            className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold mb-2
              ${user.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"}
            `}
          >
            {user.isActive ? "Activo" : "Inactivo"}
          </span>
        </div>
        <div className="mb-2">
          <p className="text-gray-500 text-xs">
            Creado:{" "}
            <span className="font-mono">
              {new Date(user.createdAt).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </p>
        </div>
        <Link to={`/user/${user.id}`} className="block w-full">
          <button className="w-full mt-2 bg-[#00478f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow text-sm sm:text-base">
            Ver Detalles
          </button>
        </Link>
      </div>
    </div>
  );
};