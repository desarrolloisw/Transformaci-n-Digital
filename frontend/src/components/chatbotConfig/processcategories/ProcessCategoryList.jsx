export default function ProcessCategoryList({ categories, onEdit, onToggleActive }) {
  console.log("Rendering ProcessCategoryList with categories:", categories);
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {categories && categories.length > 0 ? (
        categories.map(cat => (
          <div
            key={cat.id}
            className={`bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-lg border p-5 flex flex-col gap-3 min-w-0 transition-transform hover:scale-[1.03] hover:shadow-2xl group relative overflow-hidden ${cat.isActive ? 'border-blue-200 hover:border-blue-400' : 'border-gray-300 opacity-60'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-lg md:text-xl text-blue-900 group-hover:text-blue-700 transition-all drop-shadow-sm tracking-tight">
                {cat.name}
              </span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{cat.isActive ? 'Activo' : 'Inactivo'}</span>
            </div>
            <div className="text-gray-700 text-base mb-2 min-h-[32px] font-medium opacity-90">
              {cat.description}
            </div>
            <div className="flex gap-3 flex-wrap mt-auto items-end">
              <button
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-blue-600 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => onEdit(cat)}
              >
                Editar
              </button>
              {typeof onToggleActive === 'function' && (
                <button
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 focus:outline-none focus:ring-2 ${cat.isActive ? 'border-red-500 bg-red-100 text-red-700 hover:bg-red-200' : 'border-green-500 bg-green-100 text-green-700 hover:bg-green-200'}`}
                  onClick={() => onToggleActive(cat)}
                >
                  {cat.isActive ? 'Desactivar' : 'Activar'}
                </button>
              )}
            </div>
            <div className="absolute right-0 top-0 w-20 h-20 bg-blue-200 opacity-30 rounded-bl-full pointer-events-none -z-10" />
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 col-span-full py-8 text-lg font-semibold">
          No hay categorías asociadas a este proceso.
        </div>
      )}
    </div>
  );
}
