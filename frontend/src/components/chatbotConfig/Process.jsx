import { NotResults } from "../notFound/NotResults.jsx";
import { CardChatbotConfig } from "./CardChatbotConfig.jsx";
import { getGridClass } from "../../libs/functions.lib.js";
import { useGetProcesses } from "../../api/process.api";

export function Process() {
  const { data: processes = [], isLoading, isError } = useGetProcesses();

  return (
    <div className="container mx-auto p-4">
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#00478f] mb-4 text-center md:text-left">Listado de Procesos</h2>
        <div className={`${getGridClass(processes)} w-full`}>
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-32">
              <span className="text-gray-500 font-semibold">Cargando procesos...</span>
            </div>
          ) : isError ? (
            <NotResults notResultsName={"Processes"} />
          ) : processes.length === 0 ? (
            <NotResults notResultsName={"Processes"} />
          ) : (
            processes.map((proc) => (
              <CardChatbotConfig key={proc.id} data={proc} url="process" />
            ))
          )}
        </div>
      </section>
    </div>
  );
}