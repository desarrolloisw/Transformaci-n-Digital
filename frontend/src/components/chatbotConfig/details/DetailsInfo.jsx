import PropTypes from "prop-types";

export function DetailsInfo({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl border border-blue-200 p-8 shadow-none mb-4 px-4 w-full min-w-0">
      <div className="flex flex-col gap-4">
        <div>
          <span className="block text-lg font-semibold text-gray-700 mb-1">Nombre:</span>
          <span className="block text-2xl text-[#00478f] font-bold break-words">{data.name}</span>
        </div>
        <div>
          <span className="block text-lg font-semibold text-gray-700 mb-1">Estado:</span>
          <span className={`inline-block px-4 py-1 rounded-full text-base font-semibold ${data.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {data.isActive ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <span className="block text-lg font-semibold text-gray-700 mb-1">Descripción:</span>
          <span className="block text-base text-gray-800 bg-blue-50 rounded-lg p-3 min-h-[60px] break-words">
            {data.description || <span className="italic text-gray-400">Sin descripción</span>}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2">
          <div>
            <span className="block text-sm text-gray-500">Creado</span>
            <span className="block text-base text-gray-700 font-medium break-words">{data.createdAt}</span>
          </div>
          <div>
            <span className="block text-sm text-gray-500">Actualizado</span>
            <span className="block text-base text-gray-700 font-medium break-words">{data.updatedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

DetailsInfo.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }).isRequired,
};
