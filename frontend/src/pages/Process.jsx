import { NotResults } from "../components/notFound/NotResults";
import { CardProcess } from "../components/process/CardProcess";
import { getGridClass } from "../libs/functions.lib.js";
import { Sidebar } from "../components/ui/Sidebar";
import { LogoutBar } from "../components/ui/LogoutBar";
import { useState } from "react";

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

  // Estado para saber si la sidebar está abierta o cerrada
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <LogoutBar username="Juan Pérez" />
      <main className="flex-1 w-full mt-5 px-4 md:px-10 py-10 pt-14 transition-all duration-300">
        <div className="process max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#00478f] mb-3 drop-shadow-sm text-center">
            Procesos
          </h1>
          <p className="mb-10 text-lg md:text-xl text-gray-700 text-center font-medium">
            Administra los procesos de tu chatbot. Aquí puedes agregar, editar o deshabilitar procesos y categorías.
          </p>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#00478f] mb-4 text-center md:text-left">Listado de Procesos</h2>
            <div className={`${getGridClass(process)} w-full`}>
              {process.length === 0 ? (
                <NotResults notResultsName={"Processes"} />
              ) : (
                process.map((proc) => (
                  <CardProcess key={proc.id} process={proc} />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}