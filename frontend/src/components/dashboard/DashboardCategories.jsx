import { useState, useEffect } from "react";
import { DashboardCharts } from "./DashboardCharts";
import { DatesFiltersAndSelects } from "../ui/DatesFiltersAndSelects";
import { NotResults } from "../notFound/NotResults";
import { useGetCategoryCount, useGetFirstLogDate, useGetTotalQuestions } from "../../api/dashboard.api";
import { Toast } from "../ui/Toast";
import { formatToDatetimeLocal, toISOStringIfFilled } from "../../libs/functions.lib";
import { chartTypes } from "../../libs/chartTypes.lib";

export const DashboardCategories = () => {
  const [dates, setDates] = useState({ from: "", to: "" });
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [chartType, setChartType] = useState(chartTypes[0].id); // default: bar

  // Solo incluye los params si tienen valor y los convierte a ISO
  const params = {};
  if (dates.from) params.from = toISOStringIfFilled(dates.from);
  if (dates.to) params.to = toISOStringIfFilled(dates.to);

  const categoryCount = useGetCategoryCount(params);
  const firstLogDate = useGetFirstLogDate();
  const totalQuestions = useGetTotalQuestions(params);

  // Mostrar error en toast
  useEffect(() => {
    if (categoryCount.error || firstLogDate.error) {
      setToast({
        show: true,
        message: categoryCount.error?.message || firstLogDate.error?.message || "Error al cargar los datos",
        type: "error",
      });
    }
  }, [categoryCount.error, firstLogDate.error]);

  // Mostrar toast de éxito cuando se cargan datos correctamente
  useEffect(() => {
    if (categoryCount.data && !categoryCount.error && !firstLogDate.error) {
      setToast({
        show: true,
        message: "Datos cargados correctamente",
        type: "success",
      });
    }
  }, [categoryCount.data, categoryCount.error, firstLogDate.error]);

  // Cierra el toast automáticamente después de 3 segundos
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const isLoading = categoryCount.isLoading || firstLogDate.isLoading;
  const isError = categoryCount.isError || firstLogDate.isError;

  const handleDatesChange = (values) => setDates(values);
  const handleClear = () => setDates({ from: "", to: "" });

  // minDate debe estar en formato "YYYY-MM-DDTHH:mm"
  const minDate = formatToDatetimeLocal(firstLogDate.data?.firstLogDate || new Date());

  return (
    <div className="container mx-auto p-4">
      {/* Filtro y gráfica de categorías */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#00478f] mb-2 text-center md:text-left">Preguntas por Categoría</h2>
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
          <NotResults notResultsName={"Category Count"} />
        )}
        {!isLoading && !isError && (
          categoryCount.data?.length === 0 ? (
            <NotResults notResultsName={"Category Count"} />
          ) : (
            <DashboardCharts
              data={categoryCount.data || []}
              xKey="categoryName"
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