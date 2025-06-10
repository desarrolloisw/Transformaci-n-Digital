import { Link } from "react-router-dom";
import EscudoUnison from "../../assets/img/Escudo_Unison.png";

export const CardProcess = ({ process }) => {
  if (!process || !process.name) {
    return (
      <div className="flex items-center justify-center h-48 bg-red-50 rounded-lg shadow text-red-500 font-semibold">
        Proceso no encontrado
      </div>
    );
  }

  return (
    <div className="max-w-xs min-w-[260px] max-h-96 min-h-96 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-blue-100 hover:shadow-2xl transition-shadow duration-200">
      <div className="w-full h-40 flex items-center justify-center bg-gradient-to-b from-[#00478f]/80 to-blue-200">
        <img
          src={EscudoUnison}
          alt={process.name}
          className="h-28 object-contain drop-shadow-lg"
          draggable={false}
        />
      </div>
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          <h2 className="text-xl font-bold text-[#00478f] mb-1 truncate">{process.name}</h2>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2
              ${process.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"}
            `}
          >
            {process.isActive ? "Activo" : "Inactivo"}
          </span>
        </div>
        <div className="mb-2">
          <p className="text-gray-500 text-xs">
            Creado:{" "}
            <span className="font-mono">
              {new Date(process.createdAt).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </p>
        </div>
        <button className="w-full mt-2 bg-[#00478f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow hover:cursor-pointer">
          <Link to={`/process/${process.id}`} className="w-full h-full flex items-center justify-center">
            Ver Detalles
          </Link>
        </button>
      </div>
    </div>
  );
};