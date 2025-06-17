import { NotResults } from "../notFound/NotResults.jsx";
import { CardChatbotConfig } from "./CardChatbotConfig.jsx";
import { getGridClass } from "../../libs/functions.lib.js";
import { useGetProcesses } from "../../api/process.api";
import { Search } from "../ui/Search";
import { useState } from "react";

export function Process() {
  const [search, setSearch] = useState("");
  const { data: processes = [], isLoading, isError } = useGetProcesses(search ? { search } : {});

  return (
    <div className="container mx-auto p-4">
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#00478f] mb-4 text-center md:text-left">Listado de Procesos</h2>
        <div className="mb-6 max-w-md mx-auto">
          <Search value={search} onChange={setSearch} placeholder="Buscar proceso..." />
        </div>
        <div className="relative w-full">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-32">
              <span className="text-gray-500 font-semibold">Cargando procesos...</span>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center w-full h-full place-items-center">
              <NotResults notResultsName={"Processes"} />
            </div>
          ) : processes.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full place-items-center">
              <NotResults notResultsName={"Processes"} />
            </div>
          ) : (
            <div className={`${getGridClass(processes)} w-full`}>
              {processes.map((proc) => (
                <CardChatbotConfig key={proc.id} data={proc} url="process" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}