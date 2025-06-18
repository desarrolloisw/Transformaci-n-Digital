import { useState, useEffect } from "react";
import { DashboardCharts } from "./DashboardCharts";
import { DatesFiltersAndSelects } from "../ui/DatesFiltersAndSelects";
import { NotResults } from "../notFound/NotResults";
import { useGetProcessCount, useGetFirstLogDate, useGetTotalQuestions } from "../../api/dashboard.api";
import { Toast } from "../ui/Toast";
import { formatToDatetimeLocal, toISOStringIfFilled } from "../../libs/functions.lib";
import { chartTypes } from "../../libs/chartTypes.lib";

export const DashboardProcess = () => {
  const [dates, setDates] = useState({ from: "", to: "" });
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [chartType, setChartType] = useState(chartTypes[0].id); // default: bar

  // Solo incluye los params si tienen valor y los convierte a ISO
  const params = {};
  if (dates.from) params.from = toISOStringIfFilled(dates.from);
  if (dates.to) params.to = toISOStringIfFilled(dates.to);

  const processCount = useGetProcessCount(params);
  const firstLogDate = useGetFirstLogDate();
  const totalQuestions = useGetTotalQuestions(params);

  // Mostrar error en toast
  useEffect(() => {
    if (processCount.error || firstLogDate.error) {
      setToast({
        show: true,
        message: processCount.error?.message || firstLogDate.error?.message || "Error al cargar los datos",
        type: "error",
      });
    }
  }, [processCount.error, firstLogDate.error]);

  // Ejemplo: mostrar toast de éxito cuando se cargan datos correctamente
  useEffect(() => {
    if (processCount.data && !processCount.error && !firstLogDate.error) {
      setToast({
        show: true,
        message: "Datos cargados correctamente",
        type: "success",
      });
    }
  }, [processCount.data, processCount.error, firstLogDate.error]);

  const isLoading = processCount.isLoading || firstLogDate.isLoading;
  const isError = processCount.isError || firstLogDate.isError;

  const handleDatesChange = (values) => setDates(values);
  const handleClear = () => setDates({ from: "", to: "" });

  // minDate debe estar en formato "YYYY-MM-DDTHH:mm"
  const minDate = formatToDatetimeLocal(firstLogDate.data?.firstLogDate || new Date());

  return (
    <div className="container mx-auto p-4">
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#00478f] mb-2 text-center md:text-left">
          Preguntas por Proceso
        </h2>
        <div className="p-6 bg-blue-50 rounded-xl flex flex-col gap-6 items-center shadow mb-4">
          <DatesFiltersAndSelects
            onChange={handleDatesChange}
            onClear={handleClear}
            minDate={minDate}
            chartType={chartType}
            onChartTypeChange={setChartType}
          />
        </div>
        <h2 className="text-lg font-semibold text-[#00478f] mb-4 text-center md:text-left">
          Total de Preguntas:{" "}
          <span className="text-blue-600 font-bold">
            {totalQuestions.data?.total || 0}
          </span>
        </h2>
        {isLoading && (
          <div className="flex items-center justify-center h-48 bg-blue-50 rounded-lg shadow">
            <p className="text-gray-500 font-semibold">Cargando datos...</p>
          </div>
        )}

        {toast.show && (
          <Toast
            message={toast.message}
            onClose={() => setToast(t => ({ ...t, show: false }))}
            type={toast.type}
          />
        )}

        {isError && (
          <NotResults notResultsName={"Process Count"} />
        )}

        {!isLoading && !isError && (
          processCount.data?.length === 0 ? (
            <NotResults notResultsName={"Process Count"} />
          ) : (
            <DashboardCharts
              data={processCount.data || []}
              xKey="processName"
              barKey="count"
              title=""
              chartType={chartType}
            />
          )
        )}
      </section>
    </div>
  );
}