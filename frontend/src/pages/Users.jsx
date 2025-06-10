import { NotResults } from "../components/notFound/NotResults";
import { CardUser } from "../components/user/CardUser";
import { getGridClass } from "../libs/functions.lib.js";
import { Sidebar } from "../utils/Sidebar";
import { LogoutBar } from "../utils/LogoutBar";
import { useState } from "react";

export function Users() {
  const users = [
    {
      "id": 1,
      "name": "Juan",
      "lastName": "Pérez",
      "secondLastName": "García",
      "userType": {
        "name": "Administrador"
      },
      "createdAt": "2024-06-09T10:00:00-07:00",
      "updatedAt": "2024-06-09T12:00:00-07:00",
      "isActive": true
    },
    {
      "id": 2,
      "name": "María",
      "lastName": "López",
      "secondLastName": null,
      "userType": {
        "name": "Usuario"
      },
      "createdAt": "2024-06-08T09:30:00-07:00",
      "updatedAt": "2024-06-09T11:15:00-07:00",
      "isActive": false
    }
  ];

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <LogoutBar username="Juan Pérez" />
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
              {
                users.length === 0 ? (
                  <NotResults notResultsName={"Users"} />
                ) :
                users.map((user) => (
                  <CardUser key={user.id} user={user} />
                ))
              }
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}