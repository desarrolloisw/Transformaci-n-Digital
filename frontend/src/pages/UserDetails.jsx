import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetUser, useUpdateEmail, useUpdateUsername, useUpdateCompleteName, useUpdatePassword, useToggleUserEnabled, useGetUserTypes } from "../api/user.api";
import { Toast } from "../components/ui/Toast";
import { ReturnBtn } from "../components/ui/ReturnBtn";

export function UserDetails() {
  const { id } = useParams();
  const { data: user, isLoading, isError, refetch } = useGetUser(id);
  const { data: userTypes = [] } = useGetUserTypes();
  const updateEmail = useUpdateEmail();
  const updateUsername = useUpdateUsername();
  const updateName = useUpdateCompleteName();
  const updatePassword = useUpdatePassword();
  const toggleEnabled = useToggleUserEnabled();
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Form states
  const [form, setForm] = useState({
    email: "",
    username: "",
    name: "",
    lastname: "",
    secondlastname: "",
    userTypeId: "",
  });
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error states
  const [errors, setErrors] = useState({});
  const [passwordError, setPasswordError] = useState("");

  // Sync form with user data
  useEffect(() => {
    if (user) {
      setForm({
        email: user.email || "",
        username: user.username || "",
        name: user.name || "",
        lastname: user.lastName || "",
        secondlastname: user.secondLastName || "",
        userTypeId: user.userTypeId ? String(user.userTypeId) : "",
      });
      setIsActive(user.isActive);
    }
  }, [user]);

  if (isLoading) return <div className="text-center py-10 text-gray-500 font-semibold">Cargando usuario...</div>;
  if (isError || !user) return <div className="text-center py-10 text-red-500 font-semibold">No se pudo cargar el usuario.</div>;

  // User fields config (igual que en alta, pero userTypeId solo lectura)
  const userFields = [
    { name: "username", label: "Usuario", type: "text", required: true, minLength: 5, maxLength: 25, pattern: "^[a-z0-9_]+$", helper: "Solo minúsculas, números y guion bajo." },
    { name: "name", label: "Nombre", type: "text", required: true, minLength: 1, maxLength: 50 },
    { name: "lastname", label: "Primer apellido", type: "text", required: true, minLength: 1, maxLength: 50 },
    { name: "secondlastname", label: "Segundo apellido", type: "text", required: false, maxLength: 50 },
    { name: "email", label: "Correo institucional", type: "email", required: true, maxLength: 100, pattern: "^[a-zA-Z0-9_.+-]+@unison\\.mx$", helper: "Debe ser @unison.mx" },
    { name: "userTypeId", label: "Tipo de usuario", type: "select", required: true, options: userTypes.map(u => ({ value: String(u.id), label: u.name })), readOnly: true },
  ];

  // Validaciones
  const validateField = (field, value) => {
    if (field.required && !value) return "Este campo es obligatorio";
    if (field.minLength && value.length < field.minLength) return `Mínimo ${field.minLength} caracteres`;
    if (field.maxLength && value.length > field.maxLength) return `Máximo ${field.maxLength} caracteres`;
    if (field.pattern && value && !(new RegExp(field.pattern).test(value))) return field.helper || "Formato inválido";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(errs => ({ ...errs, [name]: validateField(userFields.find(fld => fld.name === name), value) }));
  };

  // --- Update actions ---
  const handleUpdate = (field) => (e) => {
    e.preventDefault();
    let errorMsg = validateField(userFields.find(fld => fld.name === field), form[field]);
    if (errorMsg) {
      setErrors(errs => ({ ...errs, [field]: errorMsg }));
      return;
    }
    if (field === "email") {
      updateEmail.mutate({ id, email: form.email }, {
        onSuccess: (res) => {
          if (res.message && res.message.includes("ya es el mismo")) {
            setToast({ show: true, message: res.message, type: "info" });
          } else {
            setToast({ show: true, message: "Correo actualizado", type: "success" });
          }
          refetch();
        },
        onError: (err) => {
          setErrors(errs => ({ ...errs, email: err.response?.data?.message || "Error al actualizar correo" }));
          setToast({ show: true, message: err.response?.data?.message || "Error al actualizar correo", type: "error" });
        }
      });
    } else if (field === "username") {
      updateUsername.mutate({ id, username: form.username }, {
        onSuccess: (res) => {
          if (res && res.message && res.message.includes("ya es el mismo")) {
            setToast({ show: true, message: res.message, type: "info" });
          } else {
            setToast({ show: true, message: "Usuario actualizado", type: "success" });
          }
          refetch();
        },
        onError: (err) => {
          setErrors(errs => ({ ...errs, username: err.response?.data?.message || "Error al actualizar usuario" }));
          setToast({ show: true, message: err.response?.data?.message || "Error al actualizar usuario", type: "error" });
        }
      });
    } else if (["name", "lastname", "secondlastname"].includes(field)) {
      updateName.mutate({ id, name: form.name, lastName: form.lastname, secondLastName: form.secondlastname }, {
        onSuccess: (res) => {
          if (res && res.message && res.message.includes("ya es el mismo")) {
            setToast({ show: true, message: res.message, type: "info" });
          } else {
            setToast({ show: true, message: "Nombre actualizado", type: "success" });
          }
          refetch();
        },
        onError: (err) => {
          setErrors(errs => ({ ...errs, name: err.response?.data?.message || "Error al actualizar nombre" }));
          setToast({ show: true, message: err.response?.data?.message || "Error al actualizar nombre", type: "error" });
        }
      });
    } else if (field === "userTypeId") {
      // Aquí deberías tener un endpoint para actualizar el tipo de usuario
      setToast({ show: true, message: "Actualización de tipo de usuario no implementada", type: "info" });
    }
  };

  // Contraseña
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setPasswordError("");
    if (!password || !confirmPassword) {
      setPasswordError("Ambos campos son obligatorios");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }
    // Validación de patrón fuerte
    const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPattern.test(password)) {
      setPasswordError("Debe tener mayúscula, minúscula, número y uno de estos caracteres especiales: @$!%*?&");
      return;
    }
    updatePassword.mutate({ id, newPassword: password, confirmNewPassword: confirmPassword }, {
      onSuccess: () => {
        setToast({ show: true, message: "Contraseña actualizada", type: "success" });
        setPassword("");
        setConfirmPassword("");
      },
      onError: (err) => {
        setPasswordError(err.response?.data?.message || "Error al actualizar contraseña");
        setToast({ show: true, message: err.response?.data?.message || "Error al actualizar contraseña", type: "error" });
      }
    });
  };

  // Estado
  const submitEnabled = (e) => {
    e.preventDefault();
    toggleEnabled.mutate({ id, isEnabled: !isActive }, {
      onSuccess: () => {
        setToast({ show: true, message: `Usuario ${!isActive ? "habilitado" : "deshabilitado"}`, type: "success" });
        setIsActive(!isActive);
        refetch();
      },
      onError: (err) => {
        setToast({ show: true, message: err.response?.data?.message || "Error al cambiar estado", type: "error" });
      }
    });
  };

  return (
    <div className="user-details max-w-3xl mx-auto px-2 sm:px-4 py-6">
      <ReturnBtn to="/users"/>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#00478f] mb-2 text-center mt-3">Detalles de Usuario</h1>
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
      <div className="flex flex-col gap-6">
        {/* Username */}
        <form onSubmit={handleUpdate("username")} className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-3 border border-blue-100">
          <label className="font-semibold text-base sm:text-lg" htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="input w-full"
            required minLength={5} maxLength={25} pattern="^[a-z0-9_]+$"
            autoComplete="off"
          />
          <div className="text-xs text-gray-500 mt-1">Solo minúsculas, números y guion bajo.</div>
          {errors.username && <div className="text-red-500 text-xs sm:text-sm">{errors.username}</div>}
          <div className="flex justify-end mt-2">
            <button type="submit" className="btn-primary" disabled={!!errors.username || form.username === (user && user.username)}>Guardar usuario</button>
          </div>
        </form>
        {/* Nombre completo (name, lastname, secondlastname) */}
        <form onSubmit={handleUpdate("name")} className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-3 border border-blue-100">
          <label className="font-semibold text-base sm:text-lg">Nombre completo</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input flex-1"
              required minLength={1} maxLength={50} placeholder="Nombre"
              autoComplete="off"
            />
            <input
              id="lastname"
              type="text"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              className="input flex-1"
              required minLength={1} maxLength={50} placeholder="Primer apellido"
              autoComplete="off"
            />
            <input
              id="secondlastname"
              type="text"
              name="secondlastname"
              value={form.secondlastname}
              onChange={handleChange}
              className="input flex-1"
              maxLength={50} placeholder="Segundo apellido (opcional)"
              autoComplete="off"
            />
          </div>
          {errors.name && <div className="text-red-500 text-xs sm:text-sm">{errors.name}</div>}
          <div className="flex justify-end mt-2">
            <button type="submit" className="btn-primary" disabled={!!errors.name || (form.name === (user && user.name) && form.lastname === (user && user.lastName) && form.secondlastname === (user && user.secondLastName))}>Guardar nombre completo</button>
          </div>
        </form>
        {/* Email */}
        <form onSubmit={handleUpdate("email")} className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-3 border border-blue-100">
          <label className="font-semibold text-base sm:text-lg" htmlFor="email">Correo institucional</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input w-full"
            required maxLength={100} pattern="^[a-zA-Z0-9_.+-]+@unison\\.mx$"
            autoComplete="off"
          />
          <div className="text-xs text-gray-500 mt-1">Debe ser @unison.mx</div>
          {errors.email && <div className="text-red-500 text-xs sm:text-sm">{errors.email}</div>}
          <div className="flex justify-end mt-2">
            <button type="submit" className="btn-primary" disabled={!!errors.email || form.email === (user && user.email)}>Guardar correo</button>
          </div>
        </form>
        {/* Contraseña */}
        <form onSubmit={handlePasswordUpdate} className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-3 border border-blue-100">
          <label className="font-semibold text-base sm:text-lg">Contraseña</label>
          <div className="relative flex-1">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input w-full pr-12"
              minLength={8}
              maxLength={72}
              placeholder="Nueva contraseña"
              autoComplete="new-password"
              data-testid="new-password-input"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-700 font-semibold"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
          <div className="relative flex-1">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="input w-full pr-12"
              minLength={8}
              maxLength={72}
              placeholder="Confirmar nueva contraseña"
              autoComplete="new-password"
              data-testid="confirm-password-input"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-700 font-semibold"
              onClick={() => setShowConfirmPassword(v => !v)}
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {showConfirmPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Debe tener mayúscula, minúscula, número y uno de estos caracteres especiales: @$!%*?&</span>
            {passwordError && <div className="text-red-500 text-xs sm:text-sm">{passwordError}</div>}
          </div>
          <div className="flex justify-end mt-2 gap-2">
            <button
              type="submit"
              className="btn-primary"
              data-testid="save-password-btn"
            >
              Guardar contraseña
            </button>
          </div>
        </form>
        {/* Estado */}
        <form onSubmit={submitEnabled} className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-3 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <label className="font-semibold text-base sm:text-lg">Estado</label>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`font-bold ${isActive ? "text-green-600" : "text-red-600"}`}>{isActive ? "Activo" : "Inactivo"}</span>
            <button type="submit" className={`btn-secondary ml-0 sm:ml-4 ${isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}>{isActive ? "Deshabilitar" : "Habilitar"}</button>
          </div>
        </form>
      </div>
      {toast.show && (
        <Toast message={toast.message} onClose={() => setToast(t => ({ ...t, show: false }))} type={toast.type} />
      )}
      <style>{`
        .input { border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 1rem; background: #f8fafc; transition: border 0.2s; width: 100%; }
        .input:focus { border-color: #2563eb; outline: none; background: #fff; }
        .btn-primary { background: #00478f; color: #fff; font-weight: bold; border-radius: 0.5rem; padding: 0.5rem 1.5rem; margin-top: 0.5rem; transition: background 0.2s; min-width: 140px; }
        .btn-primary:disabled { background: #b6c6db; cursor: not-allowed; }
        .btn-primary:hover:enabled { background: #003366; }
        .btn-secondary { color: #fff; font-weight: bold; border-radius: 0.5rem; padding: 0.5rem 1.5rem; transition: background 0.2s; min-width: 140px; }
        @media (max-width: 640px) {
          .user-details { padding: 0.5rem; }
          .btn-primary, .btn-secondary { width: 100%; min-width: 0; }
        }
      `}</style>
    </div>
  );
}