import { useState, useEffect } from "react";
import { chartTypes } from "../../libs/chartTypes.lib";

/**
 * DatesFiltersAndSelects component
 *
 * Provides a flexible filter bar with date range pickers, dynamic select dropdowns, and chart type selector.
 * Notifies parent on changes and supports clearing of all filters.
 *
 * Props:
 *   - onChange: (function) Callback called with filter values on change
 *   - onClear: (function) Callback called when filters are cleared
 *   - clearSignal: (any) Triggers clearing of all fields when changed
 *   - minDate: (string) Minimum date for the date pickers
 *   - selectsData: (array) Array of select config objects ({ label, options, value, onChange })
 *   - chartType: (string) Current chart type value
 *   - onChartTypeChange: (function) Callback for chart type change
 */

// Nuevo componente reutilizable para un select
function DynamicSelect({ label, options = [], value, onChange }) {
  const hasOptions = Array.isArray(options) && options.length > 0;

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[#00478f] text-sm font-semibold">{label}</label>
      <select
        className="rounded px-3 py-2 bg-blue-50 text-[#00478f] border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#00478f] transition w-full font-medium"
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
  selectsData = [],
  chartType,
  onChartTypeChange
}) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectValues, setSelectValues] = useState(
    selectsData.map(select => select.value || "")
  );

  useEffect(() => {
    setFromDate("");
    setToDate("");
    setSelectValues(selectsData.map(() => ""));
    // eslint-disable-next-line
    selectsData.forEach((select, idx) => {
      if (typeof select.onChange === "function") {
        select.onChange("");
      }
    });
    onChange?.({ from: "", to: "", selects: selectsData.map(() => "") });
    // eslint-disable-next-line
  }, [clearSignal]);

  const handleChange = (type, value) => {
    if (type === "from") {
      setFromDate(value);
      if (toDate && value && toDate < value) setToDate("");
      onChange?.({
        from: value,
        to: toDate && toDate >= value ? toDate : "",
        selects: selectValues
      });
    }
    if (type === "to") {
      if (fromDate && value < fromDate) return;
      setToDate(value);
      onChange?.({
        from: fromDate,
        to: value,
        selects: selectValues
      });
    }
  };

  const handleSelectChange = (idx, value) => {
    const newSelectValues = [...selectValues];
    newSelectValues[idx] = value;
    setSelectValues(newSelectValues);
    if (typeof selectsData[idx].onChange === "function") {
      selectsData[idx].onChange(value);
    }
    onChange?.({
      from: fromDate,
      to: toDate,
      selects: newSelectValues
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-end w-full mb-6">
      <div className="flex flex-col gap-1 w-full md:w-auto min-w-[180px] flex-1">
        <label className="text-[#00478f] text-sm font-semibold">Desde</label>
        <input
          type="datetime-local"
          value={fromDate}
          min={minDate || undefined}
          onChange={e => handleChange("from", e.target.value)}
          className="rounded px-3 py-2 bg-blue-50 text-[#00478f] border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#00478f] transition w-full font-medium"
        />
      </div>
      <div className="flex flex-col gap-1 w-full md:w-auto min-w-[180px] flex-1">
        <label className="text-[#00478f] text-sm font-semibold">Hasta</label>
        <input
          type="datetime-local"
          value={toDate}
          min={fromDate || minDate || undefined}
          disabled={!fromDate}
          onChange={e => handleChange("to", e.target.value)}
          className={`rounded px-3 py-2 bg-blue-50 text-[#00478f] border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#00478f] transition w-full font-medium ${!fromDate ? "opacity-60 cursor-not-allowed" : ""}`}
        />
      </div>
      {selectsData.map((select, idx) => (
        <div key={idx} className="w-full md:w-auto min-w-[180px] flex-1">
          <DynamicSelect
            label={select.label}
            options={select.options}
            value={selectValues[idx]}
            onChange={value => handleSelectChange(idx, value)}
          />
        </div>
      ))}
      {onChartTypeChange && (
        <div className="flex flex-col gap-1 w-full max-w-xs">
          <label className="text-[#00478f] text-sm font-semibold">Tipo de gráfico</label>
          <select
            className="rounded px-3 py-2 bg-blue-50 text-[#00478f] border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#00478f] transition w-full font-medium"
            value={chartType}
            onChange={e => onChartTypeChange(e.target.value)}
          >
            {chartTypes.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
      )}
      <button
        type="button"
        className="w-full md:w-auto mt-2 md:mt-6 px-4 py-2 rounded bg-[#00478f] text-white font-semibold hover:bg-blue-800 transition"
        onClick={() => {
          setFromDate("");
          setToDate("");
          const cleared = selectsData.map(() => "");
          setSelectValues(cleared);
          // eslint-disable-next-line
          selectsData.forEach((select, idx) => {
            if (typeof select.onChange === "function") {
              select.onChange("");
            }
          });
          onClear?.();
          onChange?.({ from: "", to: "", selects: cleared });
        }}
      >
        Limpiar
      </button>
    </div>
  );
}