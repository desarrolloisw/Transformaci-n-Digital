import { useForm } from "react-hook-form";
import { useLogin } from "../api/auth.api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "../components/ui/Toast";

/**
 * Login page for the Chatbot Admin Panel.
 * Handles user authentication, form validation, and displays toast notifications for errors and success.
 * On successful login, redirects user based on their role.
 */
export function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const loginMutation = useLogin();
  const [loginError, setLoginError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const navigate = useNavigate();

  // Show toast on login error
  useEffect(() => {
    if (loginError) {
      setToast({ show: true, message: loginError, type: "error" });
    }
  }, [loginError]);

  // Show toast on successful login
  useEffect(() => {
    if (loginMutation.isSuccess) {
      setToast({ show: true, message: "Inicio de sesión exitoso", type: "success" });
    }
  }, [loginMutation.isSuccess]);

  /**
   * Handles form submission and login logic.
   * Redirects user based on their role after successful login.
   */
  const onSubmit = async (data) => {
    setLoginError("");
    try {
      await loginMutation.mutateAsync({ identifier: data.username, password: data.password });
      // Map userTypeId to role
      const userTypeId = localStorage.getItem("role");
      let role = null;
      if (userTypeId === "1") role = "PAT";
      if (userTypeId === "2") role = "COORD";
      if (role === "PAT" || role === "COORD") {
        navigate("/dashboard/processes", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setLoginError(err?.response?.data?.message || err?.message || "Error al iniciar sesión");
    }
  };

  // Render login form and toast notifications
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-2xl border border-blue-100 relative">
        <div className="flex flex-col items-center mb-8">
          <img src="/Escudo_Unison.png" alt="Unison Logo" className="w-16 h-16 mb-2" />
          <h1 className="text-3xl font-extrabold text-[#00478f] mb-1 drop-shadow">Iniciar Sesión</h1>
          <span className="text-blue-900 text-opacity-60 text-sm font-medium">Panel de Administración Chatbot</span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-[#00478f] mb-1">Usuario o Email</label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-[#00478f] placeholder:text-blue-300"
              placeholder="Usuario o Correo@unison.mx"
              {...register("username", {
                required: "Campo requerido",
                minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
                validate: value => {
                  if (value.includes("@")) {
                    if (!/^([a-zA-Z0-9_.+-])+@unison\.mx$/.test(value)) {
                      return "El correo debe ser @unison.mx válido";
                    }
                    if (value.length > 100) return "El correo no debe sobrepasar los 100 caracteres.";
                  } else {
                    if (!/^[a-z0-9_]+$/.test(value)) return "Solo minúsculas, números y guion bajo.";
                    if (value.length > 25) return "El usuario no debe sobrepasar los 25 caracteres.";
                  }
                  return true;
                }
              })}
              autoComplete="username"
            />
            {errors.username && <span className="text-red-500 text-xs mt-1 block">{errors.username.message}</span>}
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-[#00478f] mb-1">Contraseña</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-[#00478f] placeholder:text-blue-300"
              placeholder="Contraseña"
              {...register("password", {
                required: "Campo requerido",
                minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
                maxLength: { value: 72, message: "No debe sobrepasar los 72 caracteres" }
              })}
              autoComplete="current-password"
            />
            {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
          </div>
          {loginError && <div className="text-red-600 text-sm text-center mt-2">{loginError}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#00478f] to-blue-500 text-white py-2 rounded-lg font-bold shadow hover:from-blue-700 hover:to-blue-600 transition-colors disabled:opacity-60 mt-2"
            disabled={isSubmitting || loginMutation.isLoading}
          >
            {isSubmitting || loginMutation.isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        {toast.show && (
          <Toast
            message={toast.message}
            onClose={() => setToast(t => ({ ...t, show: false }))}
            type={toast.type}
          />
        )}
        <div className="absolute bottom-2 left-0 w-full text-center text-xs text-blue-400 font-semibold opacity-70 select-none">
          &copy; {new Date().getFullYear()} Universidad de Sonora
        </div>
      </div>
    </div>
  );
}