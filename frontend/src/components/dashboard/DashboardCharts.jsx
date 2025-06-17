import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell, LineChart, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useState, useEffect, useCallback, useRef } from "react";

// Genera un color pastel aleatorio
function getRandomColor(idx) {
  const hue = (idx * 47) % 360;
  return `hsl(${hue}, 70%, 70%)`;
}

export const DashboardCharts = ({
  processName = null,
  data = [],
  xKey = "name",
  barKey = "Total",
  title = "Dashboard",
  emptyMessage = "No hay datos para mostrar.",
  chartType = "bar"
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

  // Renderizar el tipo de gráfico seleccionado
  function renderChart() {
    switch (chartType) {
      case "bar": {
        return (
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
            <Tooltip formatter={v => v.toLocaleString()} />
            <Legend />
            <Bar dataKey={barKey} name="Total">
              {data.map((entry, idx) => (
                <Cell key={`bar-cell-${idx}`} fill={getRandomColor(idx)} />
              ))}
            </Bar>
          </BarChart>
        );
      }
      case "pie": {
        const total = data.reduce((acc, d) => acc + (d[barKey] || 0), 0);
        return (
          <PieChart width={Math.max(320, Math.min(400, data.length * 80))} height={340}>
            <Tooltip formatter={v => v.toLocaleString()} />
            <Legend />
            <Pie
              data={data}
              dataKey={barKey}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={60}
              label={({ name, value }) => `${name}: ${value.toLocaleString()} (${((value/total)*100).toFixed(1)}%)`}
              labelLine={false}
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={getRandomColor(idx)} />
              ))}
            </Pie>
          </PieChart>
        );
      }
      case "line": {
        return (
          <LineChart data={data}>
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
            <Tooltip formatter={v => v.toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey={barKey} stroke="#8884d8" strokeWidth={3} dot />
          </LineChart>
        );
      }
      case "area": {
        return (
          <AreaChart data={data}>
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
            <Tooltip formatter={v => v.toLocaleString()} />
            <Legend />
            <Area type="monotone" dataKey={barKey} stroke="#82ca9d" fill="#82ca9d" />
          </AreaChart>
        );
      }
      case "radar": {
        return (
          <RadarChart cx="50%" cy="50%" outerRadius={Math.min(chartHeight, 120)} width={minWidth || 400} height={chartHeight} data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey={xKey} />
            <PolarRadiusAxis />
            <Radar name="Total" dataKey={barKey} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Legend />
            <Tooltip formatter={v => v.toLocaleString()} />
          </RadarChart>
        );
      }
      default:
        return null;
    }
  }

  return (
    <div
      ref={chartContainerRef}
      className="bg-white rounded-lg shadow p-4 overflow-x-auto"
    >
      <h2 className="text-lg font-bold mb-4">{title + (processName ? processName : "")}</h2>
      <div style={minWidth ? { minWidth: minWidth } : {}}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};