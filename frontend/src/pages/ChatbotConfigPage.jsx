import { Sidebar } from "../components/ui/Sidebar";
import { LogoutBar } from "../components/ui/LogoutBar";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

export function ChatbotConfig() {
  // Estado para saber si la sidebar está abierta o cerrada
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <LogoutBar username="Juan Pérez" />
      <main className="flex-1 w-full mt-5 px-4 md:px-10 py-10 pt-14 transition-all duration-300">
        <div className="process max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#00478f] mb-3 drop-shadow-sm text-center">
            Configuración del Chatbot
          </h1>
          <p className="mb-10 text-lg md:text-xl text-gray-700 text-center font-medium">
            Administra los procesos y categorías de tu chatbot. Aquí puedes agregar, editar o deshabilitar procesos y categorías.
          </p>
          <div className="flex flex-col items-center w-full">
            <nav className="flex flex-wrap justify-center gap-4 mb-10 w-full max-w-2xl">
              <NavLink
                to="processes"
                className={({ isActive }) =>
                  `flex-1 min-w-[140px] px-6 py-3 rounded-xl font-semibold shadow transition-all duration-300 flex items-center justify-center text-center
                  ${isActive
                    ? "bg-[#00478f] text-white scale-105 ring-2 ring-blue-300"
                    : "bg-blue-100 text-[#00478f] hover:bg-blue-200 hover:scale-105"}`
                }
              >
                <span className="w-full text-center">Procesos</span>
              </NavLink>
              <NavLink
                to="categories"
                className={({ isActive }) =>
                  `flex-1 min-w-[140px] px-6 py-3 rounded-xl font-semibold shadow transition-all duration-300 flex items-center justify-center text-center
                  ${isActive
                    ? "bg-[#00478f] text-white scale-105 ring-2 ring-blue-300"
                    : "bg-blue-100 text-[#00478f] hover:bg-blue-200 hover:scale-105"}`
                }
              >
                <span className="w-full text-center">Categorias</span>
              </NavLink>
            </nav>
            <section className="mb-10 w-full">
              <Outlet />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}