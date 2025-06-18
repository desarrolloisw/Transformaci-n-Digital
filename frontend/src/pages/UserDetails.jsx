import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetUser, useUpdateEmail, useUpdateUsername, useUpdateCompleteName, useUpdatePassword, useToggleUserEnabled } from "../api/user.api";
import { Toast } from "../components/ui/Toast";
import { ReturnBtn } from "../components/ui/ReturnBtn";
import UserInfoHeader from "../components/user/userdetails/UserInfoHeader";
import UserFormSection from "../components/user/userdetails/UserFormSection";
import UserPasswordFields from "../components/user/userdetails/UserPasswordFields";

/**
 * UserDetails page displays and allows editing of a single user's information.
 * Handles user data fetch, form state, validation, update actions, and toast notifications.
 * Includes sections for user info, password update, and enable/disable user.
 */
export function UserDetails() {
  const { id } = useParams();
  const { data: user, isLoading, isError, refetch } = useGetUser(id);
  const updateEmail = useUpdateEmail();
  const updateUsername = useUpdateUsername();
  const updateName = useUpdateCompleteName();
  const updatePassword = useUpdatePassword();
  const toggleEnabled = useToggleUserEnabled();
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Form state for user fields
  const [form, setForm] = useState({
    email: "",
    username: "",
    name: "",
    lastname: "",
    secondlastname: "",
  });
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error states for form fields and password
  const [errors, setErrors] = useState({});
  const [passwordError, setPasswordError] = useState("");

  // Sync form state with fetched user data
  useEffect(() => {
    if (user) {
      setForm({
        email: user.email || "",
        username: user.username || "",
        name: user.name || "",
        lastname: user.lastName || "",
        secondlastname: user.secondLastName || "",
      });
      setIsActive(user.isActive);
    }
  }, [user]);

  if (isLoading) return <div className="text-center py-10 text-gray-500 font-semibold">Cargando usuario...</div>;
  if (isError || !user) return <div className="text-center py-10 text-red-500 font-semibold">No se pudo cargar el usuario.</div>;

  // User fields configuration for validation and rendering
  const userFields = [
    { name: "username", label: "Usuario", type: "text", required: true, minLength: 5, maxLength: 25, pattern: "^[a-z0-9_]+$", helper: "Solo minúsculas, números y guion bajo." },
    { name: "name", label: "Nombre", type: "text", required: true, minLength: 1, maxLength: 50 },
    { name: "lastname", label: "Primer apellido", type: "text", required: true, minLength: 1, maxLength: 50 },
    { name: "secondlastname", label: "Segundo apellido", type: "text", required: false, maxLength: 50 },
    { name: "email", label: "Correo institucional", type: "email", required: true, maxLength: 100, pattern: "^[a-zA-Z0-9_.+-]+@unison\\.mx$", helper: "Debe ser @unison.mx" },
  ];

  /**
   * Validates a single field value based on its config.
   * @param {object} field - Field config object.
   * @param {string} value - Value to validate.
   * @returns {string} - Error message or empty string.
   */
  const validateField = (field, value) => {
    if (field.required && !value) return "Este campo es obligatorio";
    if (field.minLength && value.length < field.minLength) return `Mínimo ${field.minLength} caracteres`;
    if (field.maxLength && value.length > field.maxLength) return `Máximo ${field.maxLength} caracteres`;
    if (field.pattern && value && !(new RegExp(field.pattern).test(value))) return field.helper || "Formato inválido";
    return "";
  };

  /**
   * Handles input changes and field validation.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(errs => ({ ...errs, [name]: validateField(userFields.find(fld => fld.name === name), value) }));
  };

  /**
   * Handles update actions for username, email, and name fields.
   * Shows toast and error messages as needed.
   */
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
    }
  };

  /**
   * Handles password update logic and validation.
   * Shows toast and error messages as needed.
   */
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
    // Strong password pattern validation
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

  /**
   * Handles enabling/disabling the user account.
   * Shows toast and error messages as needed.
   */
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
      <UserInfoHeader user={user} />
      <div className="flex flex-col gap-6">
        <UserFormSection>
          {/* Usuario */}
          <div>
            <label className="font-semibold text-sm mb-1 block">Usuario</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="input"
              minLength={5}
              maxLength={25}
              pattern="^[a-z0-9_]+$"
              required
            />
            {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
            <div className="flex justify-end">
              <button
                className="btn-primary mt-2"
                onClick={handleUpdate("username")}
                disabled={form.username === (user?.username || "")}
              >
                Guardar usuario
              </button>
            </div>
          </div>
          {/* Nombre y apellidos */}
          <div>
            <label className="font-semibold text-sm mb-1 block">Nombre y apellidos</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input"
                minLength={1}
                maxLength={50}
                required
                placeholder="Nombre"
              />
              <input
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                className="input"
                minLength={1}
                maxLength={50}
                required
                placeholder="Primer apellido"
              />
              <input
                name="secondlastname"
                value={form.secondlastname}
                onChange={handleChange}
                className="input"
                maxLength={50}
                placeholder="Segundo apellido (opcional)"
              />
            </div>
            {(errors.name || errors.lastname || errors.secondlastname) && (
              <div className="flex flex-col sm:flex-row gap-2 mt-1">
                {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                {errors.lastname && <span className="text-red-500 text-xs">{errors.lastname}</span>}
                {errors.secondlastname && <span className="text-red-500 text-xs">{errors.secondlastname}</span>}
              </div>
            )}
            <div className="flex justify-end">
              <button
                className="btn-primary mt-2"
                onClick={handleUpdate("name")}
                disabled={
                  form.name === (user?.name || "") &&
                  form.lastname === (user?.lastName || "") &&
                  (form.secondlastname === (user?.secondLastName || "") || (!form.secondlastname && !user?.secondLastName))
                }
              >
                Guardar nombre y apellidos
              </button>
            </div>
          </div>
          {/* Correo institucional */}
          <div>
            <label className="font-semibold text-sm mb-1 block">Correo institucional</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              maxLength={100}
              pattern="^[a-zA-Z0-9_.+-]+@unison\\.mx$"
              required
              type="email"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
            <div className="flex justify-end">
              <button
                className="btn-primary mt-2"
                onClick={handleUpdate("email")}
                disabled={form.email === (user?.email || "")}
              >
                Guardar correo
              </button>
            </div>
          </div>
        </UserFormSection>
        <UserFormSection title="Actualizar contraseña">
          <UserPasswordFields
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            passwordError={passwordError}
            onSubmit={handlePasswordUpdate}
          />
        </UserFormSection>
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