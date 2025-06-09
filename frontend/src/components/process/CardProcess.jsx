export const CardProcess = ({process}) => {
    return (
    <div className="max-w-3xs min-w-3xs max-h-96 min-h-96 bg-white rounded-lg shadow-md overflow-hidden flex flex-col gap-2">
        {
            process && process.name ? null : <div className="text-red-500">Proceso no encontrado</div>
        }
        <div className="w-full h-48 flex items-center justify-center bg-gray-200">
            <img
                src="../src/assets/img/Escudo_Unison.png"
                alt={process.name}
                className="w-fit h-48 object-cover"
            />
        </div>
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">{process.name}</h2>
            <p className={`text-sm ${process.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {process.isActive ? 'Activo' : 'Inactivo'}
            </p>
        </div>
        <div className="px-4 pb-2">
            <p className="text-gray-700 text-sm">{process.createdAt}</p>
        </div>
        <div className="px-4 pb-4">
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                Ver Detalles
            </button>
        </div>
    </div>
    )
}