/**
 * UserInfoHeader component
 *
 * Displays a header section with basic user information:
 * - User type
 * - Creation date
 * - Last update date
 *
 * Props:
 *   - user: Object containing userType, createdAt, and updatedAt fields
 */
export default function UserInfoHeader({ user }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
      <div className="text-gray-600 text-sm">
        <span className="font-semibold">Tipo de usuario:</span> {user.userType?.name || "-"}
      </div>
      <div className="text-gray-600 text-sm">
        <span className="font-semibold">Creado:</span> {user.createdAt ? new Date(user.createdAt).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" }) : "-"}
      </div>
      <div className="text-gray-600 text-sm">
        <span className="font-semibold">Actualizado:</span> {user.updatedAt ? new Date(user.updatedAt).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" }) : "-"}
      </div>
    </div>
  );
}
