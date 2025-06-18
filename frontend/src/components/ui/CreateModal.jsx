import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

/**
 * CreateModal component
 *
 * Modal dialog for creating or editing entities via a dynamic form.
 * Supports various field types (text, textarea, select, checkbox, password, number), validation, and accessibility.
 * Handles ESC key to close, focus management, and session expiration error handling.
 *
 * Props:
 *   - open: (boolean) Whether the modal is open
 *   - onClose: (function) Callback to close the modal
 *   - onSubmit: (function) Callback with form values on submit
 *   - fields: (array) Array of field config objects ({ name, label, type, ... })
 *   - title: (string) Modal title
 *   - error: (string) Error message to display
 */

export function CreateModal({ open, onClose, onSubmit, fields, title, error }) {
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  useEffect(() => {
    if (open) {
      const initialForm = {};
      fields.forEach(field => {
        if (field.type === "checkbox" && field.name === "isActive" && form[field.name] === undefined) {
          initialForm[field.name] = true;
        }
      });
      if (Object.keys(initialForm).length > 0) setForm(f => ({ ...initialForm, ...f }));
    }
    // eslint-disable-next-line
  }, [open, fields]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const coercedForm = {};
    fields.forEach(field => {
      if (field.type === 'number') {
        coercedForm[field.name] = form[field.name] !== undefined && form[field.name] !== '' ? Number(form[field.name]) : undefined;
      } else if (field.type === 'checkbox') {
        coercedForm[field.name] = !!form[field.name];
      } else {
        coercedForm[field.name] = form[field.name];
      }
    });
    onSubmit(coercedForm);
  };

  const handleShowPasswordToggle = (name) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    if (error && error.toLowerCase().includes('no tienes sesión activa')) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0009] backdrop-blur-sm px-1 sm:px-2 animate-fadein" tabIndex={-1} ref={modalRef}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg xl:max-w-2xl mx-auto p-0 flex flex-col overflow-hidden max-h-[98vh] sm:max-h-[90vh] border border-blue-200 animate-modalpop">
        <div className="flex justify-between items-center px-4 py-3 border-b border-blue-100 bg-gradient-to-r from-blue-700 to-blue-500">
          <h3 className="text-lg sm:text-xl font-bold text-white truncate pr-2">{title}</h3>
          <button
            onClick={onClose}
            className="text-white text-2xl font-bold hover:text-red-300 transition focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full w-9 h-9 flex items-center justify-center"
            tabIndex={-1}
            aria-label="Cerrar"
          >×</button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 bg-zinc-50">
          {fields.map((field) => (
            <div
              key={field.name}
              className={
                field.type === "checkbox"
                  ? "flex items-center gap-2 col-span-full"
                  : field.type === "textarea" || field.type === "select"
                  ? "flex flex-col col-span-full"
                  : "flex flex-col"
              }
            >
              {field.type === "checkbox" ? (
                <>
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={!!form[field.name]}
                    onChange={handleChange}
                    className="accent-blue-600 w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-400"
                    id={field.name}
                  />
                  <label htmlFor={field.name} className="text-base font-semibold text-gray-700 cursor-pointer select-none">{field.label}</label>
                </>
              ) : field.type === "textarea" ? (
                <>
                  <label className="block text-base font-semibold mb-1 text-gray-700" htmlFor={field.name}>{field.label}</label>
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    className="w-full border border-blue-200 rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-base resize-none shadow-sm"
                    rows={field.rows || 3}
                    required={field.required}
                    minLength={field.minLength}
                    maxLength={field.maxLength}
                  />
                </>
              ) : field.type === "select" ? (
                <>
                  <label className="block text-base font-semibold mb-1 text-gray-700" htmlFor={field.name}>{field.label}</label>
                  <select
                    id={field.name}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    className="w-full border border-blue-200 rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-base shadow-sm"
                    required={field.required}
                  >
                    <option value="" hidden>Seleccione...</option>
                    {field.options && field.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </>
              ) : field.type === "password" ? (
                <>
                  <label className="block text-base font-semibold mb-1 text-gray-700" htmlFor={field.name}>{field.label}</label>
                  <div className="relative">
                    <input
                      id={field.name}
                      type={showPassword[field.name] ? "text" : "password"}
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                      className="w-full border border-blue-200 rounded-lg px-4 py-2 bg-blue-50 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-base shadow-sm"
                      required={field.required}
                      minLength={field.minLength}
                      maxLength={field.maxLength}
                      pattern={field.pattern}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-700 font-semibold bg-blue-100 rounded px-2 py-1 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={() => handleShowPasswordToggle(field.name)}
                      tabIndex={-1}
                      aria-label={showPassword[field.name] ? "Ocultar contraseña" : "Ver contraseña"}
                    >
                      {showPassword[field.name] ? "Ocultar" : "Ver"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <label className="block text-base font-semibold mb-1 text-gray-700" htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    className="w-full border border-blue-200 rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-base shadow-sm"
                    required={field.required}
                    minLength={field.minLength}
                    maxLength={field.maxLength}
                    pattern={field.pattern}
                  />
                </>
              )}
              {field.helper && (
                <div className="text-xs text-gray-500 mt-1">{field.helper}</div>
              )}
            </div>
          ))}
          {error && (
            <div className="col-span-full text-red-500 text-base font-semibold text-center bg-red-50 rounded-lg py-2 px-3 shadow-sm animate-shake">
              {error.toLowerCase().includes('no tienes sesión activa')
                ? 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
                : error}
            </div>
          )}
          <div className="col-span-full flex gap-2 sm:gap-4 mt-4 justify-end">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400">Cancelar</button>
            <button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-green-400">Crear</button>
          </div>
        </form>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .max-w-lg, .xl:max-w-2xl { max-width: 99vw !important; }
          .rounded-2xl { border-radius: 0.8rem !important; }
        }
        @media (max-width: 640px) {
          .max-w-lg, .xl:max-w-2xl { max-width: 100vw !important; }
          .rounded-2xl { border-radius: 0.4rem !important; }
        }
        .animate-fadein { animation: fadein 0.2s; }
        .animate-modalpop { animation: modalpop 0.25s; }
        .animate-shake { animation: shake 0.3s; }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalpop { 0% { transform: scale(0.95); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes shake { 0% { transform: translateX(0); } 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-2px); } 80% { transform: translateX(2px); } 100% { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

CreateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    options: PropTypes.array,
    rows: PropTypes.number,
    required: PropTypes.bool,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    pattern: PropTypes.string,
    helper: PropTypes.string,
  })).isRequired,
  title: PropTypes.string.isRequired,
  error: PropTypes.string,
};
