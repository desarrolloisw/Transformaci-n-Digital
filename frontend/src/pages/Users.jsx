import { NotResults } from "../components/notFound/NotResults";
import { CardUser } from "../components/user/CardUser";
import { getGridClass } from "../libs/functions.lib.js";
import { useGetUsers } from "../api/user.api.js";
import { Search } from "../components/ui/Search";
import { useState } from "react";
import { CreateBtn } from "../components/ui/CreateBtn";
import { CreateModal } from "../components/ui/CreateModal";
import { useCreateModal } from "../libs/useCreateModal.js";
import { useRegister } from "../api/auth.api";
import { useGetUserTypes } from "../api/user.api";
import { useQueryClient } from "@tanstack/react-query";
import { Toast } from "../components/ui/Toast";

export function Users() {
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading, isError } = useGetUsers(search ? { search } : {});
  const createModal = useCreateModal();
  const register = useRegister();
  const queryClient = useQueryClient();
  const { data: userTypes = [] } = useGetUserTypes();
  const [modalKey, setModalKey] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // User creation fields (match backend schema)
  const userFields = [
    { name: "username", label: "Usuario", type: "text", required: true, minLength: 5, maxLength: 25, pattern: "^[a-z0-9_]+$", helper: "Solo minúsculas, números y guion bajo." },
    { name: "name", label: "Nombre", type: "text", required: true, minLength: 1, maxLength: 50 },
    { name: "lastname", label: "Primer apellido", type: "text", required: true, minLength: 1, maxLength: 50 },
    { name: "secondlastname", label: "Segundo apellido", type: "text", required: false, maxLength: 50 },
    { name: "email", label: "Correo institucional", type: "email", required: true, maxLength: 100, pattern: "^[a-zA-Z0-9_.+\\-]+@unison\\.mx$", helper: "Debe ser @unison.mx" },
    { name: "password", label: "Contraseña", type: "password", required: true, minLength: 8, maxLength: 72, pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", helper: "Debe tener mayúscula, minúscula, número y uno de estos caracteres especiales: @$!%*?&" },
    { name: "confirmPassword", label: "Confirmar contraseña", type: "password", required: true, minLength: 8, maxLength: 72 },
    { name: "userTypeId", label: "Tipo de usuario", type: "select", required: true, options: userTypes.map(u => ({ value: u.id, label: u.name })) },
  ];

  // Limpia el formulario del modal al cerrar o crear usuario
  const handleCloseModal = () => {
    createModal.handleClose();
    setModalKey((k) => k + 1); // Cambia la key para forzar remount
  };

  const handleCreateUser = (form) => {
    // Convert userTypeId to number
    const payload = { ...form, userTypeId: Number(form.userTypeId) };
    register.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        setToast({ show: true, message: "Usuario creado exitosamente", type: "success" });
        handleCloseModal();
      },
      onError: (error) => {
        let msg = error.response?.data?.message || "Error al crear usuario";
        // Si hay errores de validación de Zod, los mostramos todos
        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          msg += ': ' + error.response.data.errors.map(e => e.message).join(' | ');
        }
        if (error.response?.data?.error) msg = error.response.data.error;
        setToast({ show: true, message: msg, type: "error" });
        createModal.setError(msg);
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <main className="flex-1 w-full mt-5 px-4 md:px-10 py-10 pt-3 transition-all duration-300">
        <div className="users max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#00478f] mb-3 drop-shadow-sm text-center">
            Usuarios
          </h1>
          <p className="mb-10 text-lg md:text-xl text-gray-700 text-center font-medium">
            Administra los usuarios que tienen acceso al sistema, puedes ver sus detalles, editar su información y gestionar su estado de actividad.
          </p>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#00478f] mb-4 text-center md:text-left">Listado de Usuarios</h2>
            <div className="mb-6 max-w-2xl mx-auto flex flex-col md:flex-row gap-2 md:gap-4 items-center">
              <div className="flex-1 w-full">
                <Search value={search} onChange={setSearch} placeholder="Buscar usuario..." />
              </div>
              <div className="w-full md:w-auto">
                <CreateBtn onClick={createModal.handleOpen} label="Crear usuario" />
              </div>
            </div>
            <div className={`relative w-full`}>
              {isLoading ? (
                <div className="col-span-full flex justify-center items-center h-32">
                  <span className="text-gray-500 font-semibold">Cargando usuarios...</span>
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center w-full h-full">
                  <NotResults notResultsName={"Users"} />
                </div>
              ) : users.length === 0 ? (
                <div className="flex items-center justify-center w-full h-full place-items-center">
                  <NotResults notResultsName={"Users"} />
                </div>
              ) : (
                <div className={`${getGridClass(users)} w-full`}>
                  {users.map((user) => (
                    <CardUser key={user.id} user={user} />
                  ))}
                </div>
              )}
            </div>
            <CreateModal
              key={modalKey}
              open={createModal.open}
              onClose={handleCloseModal}
              onSubmit={handleCreateUser}
              fields={userFields}
              title="Registrar usuario"
              error={createModal.error}
            />
            {toast.show && (
              <Toast
                message={toast.message}
                onClose={() => setToast(t => ({ ...t, show: false }))}
                type={toast.type}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}