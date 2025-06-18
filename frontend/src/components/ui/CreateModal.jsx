import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

export function CreateModal({ open, onClose, onSubmit, fields, title, error }) {
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const modalRef = useRef(null);

  // Close modal on ESC
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Focus modal for accessibility
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // Set default value for isActive checkbox
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
    // Coerce types: number fields to numbers, checkboxes to booleans
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

  // Show session expired message if error is 'No tienes sesión activa'
  useEffect(() => {
    if (error && error.toLowerCase().includes('no tienes sesión activa')) {
      // Optionally, you could auto-close the modal after a delay
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080]" tabIndex={-1} ref={modalRef}>
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-lg xl:max-w-2xl mx-2 max-h-screen overflow-y-auto focus:outline-none" style={{ outline: "none" }}>
        <h3 className="text-xl font-bold mb-4 text-[#00478f] text-center">{title}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                    className="mr-2"
                    id={field.name}
                  />
                  <label htmlFor={field.name} className="text-sm font-semibold text-gray-700 cursor-pointer">{field.label}</label>
                </>
              ) : field.type === "textarea" ? (
                <>
                  <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor={field.name}>{field.label}</label>
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 bg-blue-50"
                    rows={field.rows || 3}
                    required={field.required}
                    minLength={field.minLength}
                    maxLength={field.maxLength}
                  />
                </>
              ) : field.type === "select" ? (
                <>
                  <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor={field.name}>{field.label}</label>
                  <select
                    id={field.name}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 bg-blue-50"
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
                  <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor={field.name}>{field.label}</label>
                  <div className="relative">
                    <input
                      id={field.name}
                      type={showPassword[field.name] ? "text" : "password"}
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 bg-blue-50 pr-12"
                      required={field.required}
                      minLength={field.minLength}
                      maxLength={field.maxLength}
                      pattern={field.pattern}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-700 font-semibold"
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
                  <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 bg-blue-50"
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
            <div className="col-span-full text-red-500 text-sm font-semibold text-center">
              {error.toLowerCase().includes('no tienes sesión activa')
                ? 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
                : error}
            </div>
          )}
          <div className="col-span-full flex gap-4 mt-4 justify-end">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 font-semibold">Cancelar</button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold">Crear</button>
          </div>
        </form>
      </div>
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
    type: PropTypes.string,
    required: PropTypes.bool,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    rows: PropTypes.number,
  })).isRequired,
  title: PropTypes.string.isRequired,
  error: PropTypes.string,
};
