import { NotResults } from "../components/notFound/NotResults";
import { CardUser } from "../components/user/CardUser";
import { getGridClass } from "../libs/functions.lib.js";
import { useGetUsers } from "../api/user.api.js";

export function Users() {
  const { data: users = [], isLoading, isError } = useGetUsers();

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <main className="flex-1 w-full mt-5 px-4 md:px-10 py-10 pt-14 transition-all duration-300">
        <div className="users max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#00478f] mb-3 drop-shadow-sm text-center">
            Usuarios
          </h1>
          <p className="mb-10 text-lg md:text-xl text-gray-700 text-center font-medium">
            Administra los usuarios que tienen acceso al sistema, puedes ver sus detalles, editar su información y gestionar su estado de actividad.
          </p>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#00478f] mb-4 text-center md:text-left">Listado de Usuarios</h2>
            <div className={`${getGridClass(users)} w-full`}>
              {isLoading ? (
                <div className="col-span-full flex justify-center items-center h-32">
                  <span className="text-gray-500 font-semibold">Cargando usuarios...</span>
                </div>
              ) : isError ? (
                <NotResults notResultsName={"Users"} />
              ) : users.length === 0 ? (
                <NotResults notResultsName={"Users"} />
              ) : (
                users.map((user) => (
                  <CardUser key={user.id} user={user} />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}