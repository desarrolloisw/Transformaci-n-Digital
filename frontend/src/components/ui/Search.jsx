/**
 * Search component
 *
 * Renders a styled search input with clear button and controlled value.
 * Calls onChange with the updated value on input or clear.
 *
 * Props:
 *   - value: (string) Initial value for the search input
 *   - onChange: (function) Callback called with new value on change/clear
 *   - placeholder: (string) Placeholder text for the input (default: 'Buscar...')
 *   - className: (string) Additional CSS classes for the container
 *   - autoFocus: (boolean) Whether to auto-focus the input on mount
 */
import { useState } from "react";

export function Search({ value = "", onChange, placeholder = "Buscar...", className = "", autoFocus = false }) {
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange?.(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    onChange?.("");
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-[#00478f] transition w-full font-medium"
        autoFocus={autoFocus}
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold text-lg transition"
          title="Limpiar búsqueda"
        >
          ×
        </button>
      )}
    </div>
  );
}
