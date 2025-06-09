import { useState, useEffect } from "react";

// Nuevo componente reutilizable para un select
function DynamicSelect({ label, options = [], value, onChange }) {
  const hasOptions = Array.isArray(options) && options.length > 0;

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-gray-300 text-sm font-medium">{label}</label>
      <select
        className="rounded px-3 py-2 bg-zinc-800 text-gray-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="" hidden>Selecciona...</option>
        {!hasOptions && (
          <option disabled value="">No hay nada</option>
        )}
        {hasOptions && options.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
    </div>
  );
}

export function DatesFiltersAndSelects({
  onChange,
  onClear,
  clearSignal,
  minDate,
  selectsData = [] // [{ label, options: [{id, name}], value, onChange }]
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Limpia los campos si clearSignal cambia
  useEffect(() => {
    setFrom("");
    setTo("");
    selectsData.forEach(select => {
      if (typeof select.onChange === "function") {
        select.onChange("");
      }
    });
    onChange?.({ from: "", to: "" }); // <-- Notifica al padre del reseteo
  }, [clearSignal]);

  // Maneja cambios y notifica al padre
  const handleChange = (type, value) => {
    if (type === "from") {
      setFrom(value);
      if (to && value && to < value) setTo("");
      onChange?.({ from: value, to: to && to >= value ? to : "" });
    }
    if (type === "to") {
      if (from && value < from) return;
      setTo(value);
      onChange?.({ from, to: value });
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-stretch w-full max-w-2xl mx-auto bg-zinc-900 p-4 rounded-xl shadow-lg border border-zinc-700">
      <div className="flex flex-col gap-1 w-full md:w-auto min-w-[180px] flex-1">
        <label className="text-gray-300 text-sm font-medium">Desde</label>
        <input
          type="datetime-local"
          value={from}
          min={minDate || undefined}
          onChange={e => handleChange("from", e.target.value)}
          className="rounded px-3 py-2 bg-zinc-800 text-gray-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
        />
      </div>
      <div className="flex flex-col gap-1 w-full md:w-auto min-w-[180px] flex-1">
        <label className="text-gray-300 text-sm font-medium">Hasta</label>
        <input
          type="datetime-local"
          value={to}
          min={from || minDate || undefined}
          disabled={!from}
          onChange={e => handleChange("to", e.target.value)}
          className={`rounded px-3 py-2 bg-zinc-800 text-gray-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full ${!from ? "opacity-60 cursor-not-allowed" : ""}`}
        />
      </div>
      {selectsData.map((select, idx) => (
        <div key={idx} className="w-full md:w-auto min-w-[180px] flex-1">
          <DynamicSelect
            label={select.label}
            options={select.options}
            value={select.value}
            onChange={select.onChange}
          />
        </div>
      ))}
      <button
        type="button"
        className="w-full md:w-auto mt-2 md:mt-6 px-4 py-2 rounded bg-rose-500 text-white font-semibold hover:bg-rose-600 transition"
        onClick={() => {
          setFrom("");
          setTo("");
          // Limpia los selects controlados desde el padre
          selectsData.forEach(select => {
            if (typeof select.onChange === "function") {
              select.onChange("");
            }
          });
          onClear?.();
        }}
      >
        Limpiar
      </button>
    </div>
  );
}