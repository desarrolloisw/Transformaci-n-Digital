import { NavLink, Outlet } from "react-router-dom";

/**
 * ChatbotConfig page provides the main configuration interface for chatbot processes and categories.
 * Renders navigation tabs for processes and categories, and displays the selected section using Outlet.
 * Includes responsive layout and modern UI for a clean admin experience.
 */
export function ChatbotConfig() {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <main className="flex-1 w-full mt-3 px-2 sm:px-4 md:px-10 py-6 transition-all duration-300">
        <div className="process max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00478f] mb-2 sm:mb-3 drop-shadow-sm text-center">
            Configuración del Chatbot
          </h1>
          <p className="mb-6 sm:mb-10 text-base sm:text-lg md:text-xl text-gray-700 text-center font-medium">
            Administra los procesos y categorías de tu chatbot. Aquí puedes agregar, editar o deshabilitar procesos y categorías.
          </p>
          <div className="flex flex-col items-center w-full">
            {/* Navigation tabs for processes and categories */}
            <nav className="flex xs:flex-row flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-10 w-full max-w-2xl">
              <NavLink
                to="processes"
                className={({ isActive }) =>
                  `flex-1 min-w-[120px] sm:min-w-[140px] px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow transition-all duration-300 flex items-center justify-center text-center text-sm sm:text-base
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
                  `flex-1 min-w-[120px] sm:min-w-[140px] px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow transition-all duration-300 flex items-center justify-center text-center text-sm sm:text-base
                  ${isActive
                    ? "bg-[#00478f] text-white scale-105 ring-2 ring-blue-300"
                    : "bg-blue-100 text-[#00478f] hover:bg-blue-200 hover:scale-105"}`
                }
              >
                <span className="w-full text-center">Categorias</span>
              </NavLink>
            </nav>
            {/* Section for rendering the selected configuration (processes or categories) */}
            <section className="mb-6 sm:mb-10 w-full">
              <Outlet />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}