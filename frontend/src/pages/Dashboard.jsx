import { useState } from "react";
import { NotResults } from "../components/notFound/NotResults";
import { DashboardCharts } from "../components/dashboard/DashboardCharts";
import { DatesFiltersAndSelects } from "../utils/DatesFiltersAndSelects";
import { Sidebar } from "../utils/Sidebar";
import { LogoutBar } from "../utils/LogoutBar";

export function Dashboard() {
  const [dates, setDates] = useState({ from: "", to: "" });
  const [resetCounter, setResetCounter] = useState(0);

  const handleDatesChange = (values) => {
    setDates(values);
  };

  const handleClear = () => {
    setDates({ from: "", to: "" });
  };

  // Mock data for selects
  const selectsData = [
    {
      label: "Role",
      options: [
        { id: 1, name: "Admin" },
        { id: 2, name: "User" }
      ],
      value: "",
      onChange: () => {}
    },
    {
      label: "Status",
      options: [],
      value: "",
      onChange: () => {}
    }
  ];

  // Mocks
  const getProcessCount = [
    { "processId": 1, "processName": "Inscripciones", "count": 15 },
    { "processId": 2, "processName": "Becas", "count": 8 },
    { "processId": 3, "processName": "Titulación", "count": 0 },
    { "processId": 4, "processName": "Admisión", "count": 5 },
    { "processId": 5, "processName": "Reinscripción", "count": 12 }
  ];

  const getCategoryCount = [
    { "categoryId": 1, "categoryName": "Requisitos", "count": 10 },
    { "categoryId": 2, "categoryName": "Fechas", "count": 5 },
    { "categoryId": 3, "categoryName": "Costos", "count": 0 },
    { "categoryId": 4, "categoryName": "Documentación", "count": 8 },
    { "categoryId": 5, "categoryName": "Procedimientos", "count": 3 }
  ];

  const getCategoryCountByProcess = [
    { "categoryId": 1, "categoryName": "Requisitos", "count": 7 },
    { "categoryId": 2, "categoryName": "Fechas", "count": 2 },
    { "categoryId": 3, "categoryName": "Costos", "count": 0 },
    { "categoryId": 4, "categoryName": "Documentación", "count": 5 },
    { "categoryId": 5, "categoryName": "Procedimientos", "count": 1 }
  ];

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar />
      <LogoutBar username="Juan Pérez" />
      <main className="flex-1 w-full mt-5 px-4 md:px-10 py-10 pt-14 transition-all duration-300">
        <div className="dashboard max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#00478f] mb-3 drop-shadow-sm text-center">
            Dashboard
          </h1>
          <p className="mb-10 text-lg md:text-xl text-gray-700 text-center font-medium">
            Bienvenido al dashboard, aquí puedes ver un resumen de las preguntas más frecuentes y los procesos más consultados por los usuarios. Utiliza los filtros para ajustar la visualización de datos según tus necesidades.
          </p>

          {/* Filtro y gráfica de procesos */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#00478f] mb-2 text-center md:text-left">Preguntas por Proceso</h2>
            <div className="p-6 bg-blue-50 rounded-xl flex flex-col gap-6 items-center shadow mb-4">
              <DatesFiltersAndSelects
                onChange={handleDatesChange}
                onClear={handleClear}
                clearSignal={resetCounter}
              />
            </div>
            {getProcessCount.length === 0 ? (
              <NotResults notResultsName={"Process Count"} />
            ) : (
              <DashboardCharts
                data={getProcessCount}
                xKey="processName"
                barKey="count"
                title=""
              />
            )}
          </section>

          {/* Filtro y gráfica de categorías */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#00478f] mb-2 text-center md:text-left">Preguntas por Categoría</h2>
            <div className="p-6 bg-blue-50 rounded-xl flex flex-col gap-6 items-center shadow mb-4">
              <DatesFiltersAndSelects
                onChange={handleDatesChange}
                onClear={handleClear}
                clearSignal={resetCounter}
              />
            </div>
            {getCategoryCount.length === 0 ? (
              <NotResults notResultsName={"Category Count"} />
            ) : (
              <DashboardCharts
                data={getCategoryCount}
                xKey="categoryName"
                barKey="count"
                title=""
              />
            )}
          </section>

          {/* Filtro y gráfica de categorías por proceso */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#00478f] mb-2 text-center md:text-left">Preguntas por Categoría del Proceso</h2>
            <div className="p-6 bg-blue-50 rounded-xl flex flex-col gap-6 items-center shadow mb-4">
              <DatesFiltersAndSelects
                onChange={handleDatesChange}
                onClear={handleClear}
                selectsData={selectsData}
                clearSignal={resetCounter}
              />
            </div>
            {getCategoryCountByProcess.length === 0 ? (
              <NotResults notResultsName={"Category Count by Process"} />
            ) : (
              <DashboardCharts
                processName="Servicio social"
                data={getCategoryCountByProcess}
                xKey="categoryName"
                barKey="count"
                title=""
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}