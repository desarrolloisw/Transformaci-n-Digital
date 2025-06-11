import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineHome, HiOutlineUserGroup, HiOutlineClipboardList, HiMenu, HiX } from "react-icons/hi";

const sidebarItems = [
  { title: "Dashboard", to: "/", icon: <HiOutlineHome size={22} /> },
  { title: "Usuarios", to: "/users", icon: <HiOutlineUserGroup size={22} /> },
  { title: "Configuración del Chatbot", to: "/chatbot-config", icon: <HiOutlineClipboardList size={22} /> },
];

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  return (
    <>
      {/* Botón flotante para abrir/cerrar */}
      <button
        className="fixed top-6 z-50 p-2 rounded-full bg-[#00478f] text-white shadow-lg transition-all duration-300 hover:cursor-pointer hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          left: open ? '16.5rem' : '0.5rem',
        }}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? <HiX size={28} /> : <HiMenu size={28} />}
      </button>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-gradient-to-b from-[#00478f] via-blue-800 to-blue-900 shadow-2xl flex flex-col items-center transition-all duration-300
        ${open ? "w-60 md:w-64" : "w-0"} overflow-hidden`}
        style={{
          minWidth: open ? "15rem" : "0",
        }}
      >
        {/* Imagen superior */}
        <div className="w-full flex justify-center items-center py-6 bg-opacity-80">
          <img
            src="../src/assets/img/Escudo_Unison.png"
            alt="Logo Unison"
            className="w-20 h-20 rounded-full shadow-lg border-4 border-white object-cover bg-white"
            draggable={false}
          />
        </div>
        {/* Menú */}
        <ul className="flex-1 w-full px-2 space-y-2 mt-4">
          {sidebarItems.map((item, idx) => {
            const isActive =
              item.to === "/"
                ? location.pathname === "/" || location.pathname.startsWith("/dashboard")
                : location.pathname.startsWith(item.to);

            return (
              <li key={idx}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base transition-all duration-200
                    ${
                      isActive
                        ? "bg-white bg-opacity-90 text-[#00478f] shadow"
                        : "text-white hover:bg-white/20 hover:text-blue-200"
                    }
                  `}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="transition-transform duration-300">{item.icon}</span>
                  <span
                    className={`transition-all duration-300 ${open ? "opacity-100" : "opacity-0"} ${open ? "ml-0" : "ml-[-999px]"} whitespace-nowrap max-w-[8.5rem] md:max-w-[10rem] overflow-hidden text-ellipsis`}
                    title={item.title}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        {/* Footer decorativo */}
        <div className="w-full py-4 flex justify-center items-end">
          <span className="text-xs text-white/70 font-mono tracking-widest">UNISON © {new Date().getFullYear()}</span>
        </div>
      </aside>
      {/* Espaciador para el contenido */}
      <div className={`${open ? "w-60 md:w-64" : "w-0"} transition-all duration-300`} />
    </>
  );
};