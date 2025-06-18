export default function ProcessCategoryList({ categories, onEdit, onToggleActive }) {
  console.log("Rendering ProcessCategoryList with categories:", categories);
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-1 sm:px-0">
      {categories && categories.length > 0 ? (
        categories.map(cat => (
          <div
            key={cat.id}
            className={`bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-3xl shadow-xl border p-5 flex flex-col gap-3 min-w-0 transition-transform hover:scale-[1.03] hover:shadow-2xl group relative overflow-hidden ${cat.isActive ? 'border-blue-300 hover:border-blue-500' : 'border-gray-300 opacity-60'}`}
          >
            <div className="flex flex-col items-center gap-2 mb-1 text-center">
              <span className="font-extrabold text-lg md:text-xl text-blue-900 group-hover:text-blue-700 transition-all drop-shadow-sm tracking-tight">
                {cat.name}
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm tracking-wide ${cat.isActive ? 'bg-gradient-to-r from-green-400 to-green-200 text-green-900 border border-green-300' : 'bg-gradient-to-r from-red-200 to-red-100 text-red-800 border border-red-300'}`}>{cat.isActive ? 'Activo' : 'Inactivo'}</span>
            </div>
            <div className="text-gray-700 text-base mb-2 min-h-[32px] font-medium opacity-90 text-center break-words">
              {cat.description}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap mt-auto items-center justify-center">
              <button
                className="px-5 py-2 rounded-xl text-sm font-bold border border-blue-600 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95"
                onClick={() => onEdit(cat)}
              >
                Editar
              </button>
              {typeof onToggleActive === 'function' && (
                <button
                  className={`px-5 py-2 rounded-xl text-sm font-bold border transition-all duration-200 focus:outline-none focus:ring-2 active:scale-95 ${cat.isActive ? 'border-red-500 bg-gradient-to-r from-red-200 to-red-100 text-red-800 hover:from-red-300 hover:to-red-200' : 'border-green-500 bg-gradient-to-r from-green-200 to-green-100 text-green-900 hover:from-green-300 hover:to-green-200'}`}
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
      <style>{`
        @media (max-width: 640px) {
          .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
