import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Componente Dashboard para mostrar una gráfica de barras reutilizable y responsiva.
 */
export const DashboardCharts = ({
  processName = null,
  data = [],
  xKey = "name",
  barKey = "Total",
  title = "Dashboard",
  color = "#2563eb",
  emptyMessage = "No hay datos para mostrar.",
}) => {
  const chartContainerRef = useRef(null);

  // Altura responsiva: más grande en laptop, más pequeña en móvil/tablet
  const getChartHeight = useCallback(() => {
    if (window.innerWidth < 640) return 260; // sm
    if (window.innerWidth < 1024) return 350; // md
    return 500; // laptop y más
  }, []);

  // Ancho mínimo para evitar que las etiquetas se encimen en móvil
  const getChartMinWidth = useCallback(() => {
    if (window.innerWidth < 640) return Math.max(data.length * 90, 320);
    if (window.innerWidth < 1024) return Math.max(data.length * 80, 500);
    return 0; // 0 = 100% del contenedor
  }, [data.length]);

  const [chartHeight, setChartHeight] = useState(getChartHeight());
  const [minWidth, setMinWidth] = useState(getChartMinWidth());

  // ResizeObserver para detectar cambios en el contenedor (ej. sidebar)
  useEffect(() => {
    const handleResize = () => {
      setChartHeight(getChartHeight());
      setMinWidth(getChartMinWidth());
    };

    handleResize();

    let observer;
    const chartNode = chartContainerRef.current;
    if (chartNode && "ResizeObserver" in window) {
      observer = new window.ResizeObserver(() => {
        handleResize();
      });
      observer.observe(chartNode);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (observer && chartNode) {
        observer.unobserve(chartNode);
      }
    };
  }, [data.length, getChartHeight, getChartMinWidth]);

  if (!data.length) {
    return (
      <div className="w-full text-center text-gray-500 py-8">{emptyMessage}</div>
    );
  }

  return (
    <div
      ref={chartContainerRef}
      className="bg-white rounded-lg shadow p-4 overflow-x-auto"
    >
      <h2 className="text-lg font-bold mb-4">{title + (processName ? processName : "")}</h2>
      <div style={minWidth ? { minWidth: minWidth } : {}}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xKey}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={window.innerWidth < 640 ? 60 : 100}
              tickFormatter={value => value.length > 12 ? `${value.slice(0, 12)}...` : value}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey={barKey} fill={color} name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};