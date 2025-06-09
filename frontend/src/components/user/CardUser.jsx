export const CardUser = ({user}) => {
    return (

    <div className="max-w-3xs min-w-3xs max-h-96 min-h-96 bg-white rounded-lg shadow-md overflow-hidden flex flex-col gap-2">
        {
            user && user.name ? null : <div className="text-red-500">Uusario no encontrado</div>
        }
        <div className="w-full h-48 flex items-center justify-center bg-gray-200">
            <img
                src="../src/assets/img/default_user.png"
                alt={user.name + ' ' + user.lastName + ' ' + (user.secondLastName? user.secondLastName : '')}
                className="w-fit h-48 object-cover"
            />
        </div>
        <div className="px-4">
            <p className="text-sm text-gray-500 mb-1">{user.userType.name}</p>
        </div>
        <div className="px-4 py-1">
            <h2 className="text-lg font-semibold mb-2">{user.name + ' ' + user.lastName + ' ' + (user.secondLastName? user.secondLastName : '')}</h2>
            <p className={`text-sm ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {user.isActive ? 'Activo' : 'Inactivo'}
            </p>
        </div>
        <div className="px-4 pb-2">
            <p className="text-gray-700 text-sm">{user.createdAt}</p>
        </div>
        <div className="px-4 pb-4">
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                Ver Detalles
            </button>
        </div>
    </div>
    )
}