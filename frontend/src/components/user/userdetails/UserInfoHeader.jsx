// Muestra la cabecera con info básica del usuario
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
