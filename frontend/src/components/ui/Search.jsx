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
