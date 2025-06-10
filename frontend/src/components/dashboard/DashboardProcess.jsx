import { useState } from "react";
import { DashboardCharts } from "./DashboardCharts";
import { DatesFiltersAndSelects } from "../ui/DatesFiltersAndSelects";
import { NotResults } from "../notFound/NotResults";

export const DashboardProcess = () => {
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
    
      // Mocks
      const getProcessCount = [
        { "processId": 1, "processName": "Inscripciones", "count": 15 },
        { "processId": 2, "processName": "Becas", "count": 8 },
        { "processId": 3, "processName": "Titulación", "count": 0 },
        { "processId": 4, "processName": "Admisión", "count": 5 },
        { "processId": 5, "processName": "Reinscripción", "count": 12 }
      ];
    return (
        <div className="container mx-auto p-4">
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
        </div>
    );
}