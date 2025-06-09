import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

/**
 * Componente Dashboard para mostrar una gráfica de barras reutilizable.
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
  if (!data.length) {
    return (
      <div className="w-full text-center text-gray-500 py-8">{emptyMessage}</div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow p-4 m-4">
      <h2 className="text-lg font-bold mb-4">{title + (processName? processName : '')}</h2>
      <ResponsiveContainer width="100%" height={650}>	
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xKey}
            angle={-45} // Rota las etiquetas
            textAnchor="end" // Ancla el texto al final
            interval={0} // Muestra todas las etiquetas
            height={100} // Da más espacio para las etiquetas
            tickFormatter={value => value.length > 12 ? `${value.slice(0, 12)}...` : value} // Trunca etiquetas largas
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey={barKey} fill={color} name="Total"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};