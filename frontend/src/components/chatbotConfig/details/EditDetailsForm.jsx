import PropTypes from "prop-types";
import { useState } from "react";

/**
 * EditDetailsForm component
 *
 * Renders a form for editing the details of a process or category entity.
 * Handles form state, validation, and submission.
 *
 * Props:
 *   - data: (object) Initial entity data (expects name, description, isActive)
 *   - onCancel: (function) Handler for cancel action
 *   - onSave: (function) Handler for save action, receives form values
 */

export function EditDetailsForm({ data, onCancel, onSave }) {
  const [form, setForm] = useState({
    name: data.name,
    description: data.description || "",
    isActive: data.isActive,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type: t, checked } = e.target;
    setForm((f) => ({ ...f, [name]: t === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setError(null);
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 my-4 px-4 w-full min-w-0">
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-1">
          Nombre:
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-[#00478f] font-bold bg-blue-50"
          required
        />
      </div>
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-1">
          Descripción:
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 bg-blue-50"
          rows={3}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
          id="isActive"
        />
        <label htmlFor="isActive" className="text-base text-gray-700">
          Activo
        </label>
      </div>
      {error && (
        <div className="text-red-500 text-sm font-semibold">{error}</div>
      )}
      <div className="flex gap-4 my-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 font-semibold"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

EditDetailsForm.propTypes = {
  data: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
