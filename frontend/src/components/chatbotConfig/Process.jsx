import { NotResults } from "../notFound/NotResults.jsx";
import { CardChatbotConfig } from "./CardChatbotConfig.jsx";
import { getGridClass } from "../../libs/functions.lib.js";

export function Process() {
  // Mock data for processes and counts
  const process = [
    {
      id: 1,
      name: "Proceso de Inscripción",
      isActive: true,
      createdAt: "2023-10-01T12:00:00Z"
    },
    {
      id: 2,
      name: "Proceso de Evaluación",
      isActive: false,
      createdAt: "2023-10-02T12:00:00Z"
    },
    {
      id: 3,
      name: "Proceso de Admisión",
      isActive: true,
      createdAt: "2023-10-03T12:00:00Z"
    },
    {
      id: 4,
      name: "Proceso de Graduación",
      isActive: true,
      createdAt: "2023-10-04T12:00:00Z"
    },
    {
      id: 5,
      name: "Proceso de Reinscripción",
      isActive: false,
      createdAt: "2023-10-05T12:00:00Z"
    }
  ];

  return (
        <div className="container mx-auto p-4">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#00478f] mb-4 text-center md:text-left">Listado de Procesos</h2>
            <div className={`${getGridClass(process)} w-full`}>
              {process.length === 0 ? (
                <NotResults notResultsName={"Processes"} />
              ) : (
                process.map((proc) => (
                  <CardChatbotConfig key={proc.id} data={proc} url="process"/>
                ))
              )}
            </div>
          </section>
    </div>
  );
}