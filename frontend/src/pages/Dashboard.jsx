import { NavLink, Outlet } from "react-router-dom";

export function Dashboard() {
  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <main className="flex-1 max-w-dvw mt-5 px-4 md:px-10 py-10 pt-3 transition-all duration-300">
        <div className="dashboard max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#00478f] mb-3 drop-shadow-sm text-center">
            Dashboard
          </h1>
          <p className="mb-10 text-lg md:text-xl text-gray-700 text-center font-medium">
            Bienvenido al dashboard, aquí puedes ver un resumen de las preguntas más frecuentes y los procesos más consultados por los usuarios. Utiliza los filtros para ajustar la visualización de datos según tus necesidades.
          </p>
          <div className="flex flex-col items-center w-full">
            <h3 className="text-2xl font-bold text-[#00478f] mb-6 text-center">
              Selecciona una de las diferentes opciones de gráficos para visualizar los datos:
            </h3>
            <nav className="flex flex-wrap justify-center gap-4 mb-10 w-full max-w-2xl">
              <NavLink
                to="dashboard/processes"
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
                to="dashboard/categories"
                className={({ isActive }) =>
                  `flex-1 min-w-[140px] px-6 py-3 rounded-xl font-semibold shadow transition-all duration-300 flex items-center justify-center text-center
                  ${isActive
                    ? "bg-[#00478f] text-white scale-105 ring-2 ring-blue-300"
                    : "bg-blue-100 text-[#00478f] hover:bg-blue-200 hover:scale-105"}`
                }
              >
                <span className="w-full text-center">Categorias</span>
              </NavLink>
              <NavLink
                to="dashboard/categoriesbyprocess"
                className={({ isActive }) =>
                  `flex-1 min-w-[180px] px-6 py-3 rounded-xl font-semibold shadow transition-all duration-300 flex items-center justify-center text-center
                  ${isActive
                    ? "bg-[#00478f] text-white scale-105 ring-2 ring-blue-300"
                    : "bg-blue-100 text-[#00478f] hover:bg-blue-200 hover:scale-105"}`
                }
              >
                <span className="w-full text-center">Categorias por procesos</span>
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