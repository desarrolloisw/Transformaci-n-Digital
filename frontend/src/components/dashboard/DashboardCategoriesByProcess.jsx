import { useState } from "react";
import { DashboardCharts } from "./DashboardCharts";
import { DatesFiltersAndSelects } from "../ui/DatesFiltersAndSelects";
import { NotResults } from "../notFound/NotResults";

export const DashboardCategoriesByProcess = () => {
      // eslint-disable-next-line
      const [dates, setDates] = useState({ from: "", to: "" });
      // eslint-disable-next-line
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
    const getCategoryCountByProcess = [
        { "categoryId": 1, "categoryName": "Requisitos", "count": 7 },
        { "categoryId": 2, "categoryName": "Fechas", "count": 2 },
        { "categoryId": 3, "categoryName": "Costos", "count": 0 },
        { "categoryId": 4, "categoryName": "Documentación", "count": 5 },
        { "categoryId": 5, "categoryName": "Procedimientos", "count": 1 }
    ];

    return (
        <div className="container mx-auto p-4">
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
    );
}