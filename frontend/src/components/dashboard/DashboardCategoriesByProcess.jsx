import { useState, useEffect } from "react";
import { DashboardCharts } from "./DashboardCharts";
import { DatesFiltersAndSelects } from "../ui/DatesFiltersAndSelects";
import { NotResults } from "../notFound/NotResults";
import { formatToDatetimeLocal, toISOStringIfFilled } from "../../libs/functions.lib";
import { useGetCategoryCountByProcess, useGetFirstLogDate, useGetTotalQuestionsByProcess } from "../../api/dashboard.api";
import { useGetProcesses } from "../../api/process.api";
import { Toast } from "../ui/Toast";
import { chartTypes } from "../../libs/chartTypes.lib";

export const DashboardCategoriesByProcess = () => {
  const [dates, setDates] = useState({ from: "", to: "" });
  const [selectedProcess, setSelectedProcess] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [chartType, setChartType] = useState(chartTypes[0].id); // default: bar

  // Obtener procesos para el select
  const processes = useGetProcesses();
  const firstLogDate = useGetFirstLogDate();

  // Solo incluye los params si tienen valor y los convierte a ISO
  const params = {};
  if (selectedProcess) params.processId = selectedProcess;
  if (dates.from) params.from = toISOStringIfFilled(dates.from);
  if (dates.to) params.to = toISOStringIfFilled(dates.to);

  const categoryCountByProcess = useGetCategoryCountByProcess(params);
  const totalQuestionsByProcess = useGetTotalQuestionsByProcess(params);

  // Mostrar error en toast
  useEffect(() => {
    if (categoryCountByProcess.error || firstLogDate.error) {
      setToast({
        show: true,
        message: categoryCountByProcess.error?.message || firstLogDate.error?.message || "Error al cargar los datos",
        type: "error",
      });
    }
  }, [categoryCountByProcess.error, firstLogDate.error]);

  // Mostrar toast de éxito cuando se cargan datos correctamente
  useEffect(() => {
    if (
      categoryCountByProcess.data &&
      !categoryCountByProcess.error &&
      !firstLogDate.error
    ) {
      setToast({
        show: true,
        message: "Datos cargados correctamente",
        type: "success",
      });
    }
  }, [categoryCountByProcess.data, categoryCountByProcess.error, firstLogDate.error]);

  const isLoading = categoryCountByProcess.isLoading || firstLogDate.isLoading || processes.isLoading;
  const isError = categoryCountByProcess.isError || firstLogDate.isError || processes.isError;

  const handleDatesChange = (values) => setDates(values);
  const handleClear = () => {
    setDates({ from: "", to: "" });
    setSelectedProcess("");
  };

  // minDate debe estar en formato "YYYY-MM-DDTHH:mm"
  const minDate = formatToDatetimeLocal(firstLogDate.data?.firstLogDate || new Date());

  // Select para procesos
  const selectsData = [
    {
      label: "Proceso",
      options: (processes.data || []).map(p => ({ id: p.id, name: p.name })),
      value: selectedProcess,
      onChange: (val) => {
        setSelectedProcess(val);
        setDates({ from: "", to: "" });
      },
    },
  ];

  // Get total questions for the selected process
  let totalQuestions = 0;
  if (selectedProcess && totalQuestionsByProcess.data && typeof totalQuestionsByProcess.data.total === 'number') {
    totalQuestions = totalQuestionsByProcess.data.total;
  }

  // Si no hay proceso seleccionado, no mostrar nada
  if (!selectedProcess) {
    return (
      <div className="container mx-auto p-4">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#00478f] mb-2 text-center md:text-left">
            Preguntas por Categoría del Proceso
          </h2>
          <div className="p-6 bg-blue-50 rounded-xl flex flex-col gap-6 items-center shadow mb-4">
            <DatesFiltersAndSelects
              onChange={handleDatesChange}
              onClear={handleClear}
              selectsData={selectsData}
              minDate={minDate}
              chartType={chartType}
              onChartTypeChange={setChartType}
            />
          </div>
          <div className="flex items-center justify-center h-32 bg-blue-50 rounded-lg shadow">
            <p className="text-gray-500 font-semibold">Selecciona un proceso para ver los datos.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Filtro y gráfica de categorías por proceso */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#00478f] mb-2 text-center md:text-left">
          Preguntas por Categoría del Proceso
        </h2>
        <div className="p-6 bg-blue-50 rounded-xl flex flex-col gap-6 items-center shadow mb-4">
          <DatesFiltersAndSelects
            onChange={handleDatesChange}
            onClear={handleClear}
            selectsData={selectsData}
            minDate={minDate}
            chartType={chartType}
            onChartTypeChange={setChartType}
          />
        </div>
        <h2 className="text-lg font-semibold text-[#00478f] mb-4 text-center md:text-left">
          Total de Preguntas:{" "}
          <span className="text-blue-600 font-bold">
            {totalQuestions}
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
          <NotResults notResultsName={"Category Count by Process"} />
        )}
        {!isLoading && !isError && (
          (categoryCountByProcess.data?.length === 0 ? (
            <NotResults notResultsName={"Category Count by Process"} />
          ) : (
            <DashboardCharts
              processName={
                (processes.data || []).find(p => p.id === selectedProcess)?.name || ""
              }
              data={categoryCountByProcess.data || []}
              xKey="categoryName"
              barKey="count"
              title=""
              chartType={chartType}
            />
          ))
        )}
      </section>
    </div>
  );
};