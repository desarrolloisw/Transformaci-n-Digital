export default function ProcessCategoryAdd({ categoriesNotInProcess, loading, onAdd, selectedCategoryId, setSelectedCategoryId }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-2 bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-3xl shadow-2xl border border-blue-200 p-4 sm:p-7 flex flex-col gap-4 animate-fadein">
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-green-400 shadow text-white text-2xl">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z"/></svg>
        </span>
        <h3 className="font-bold text-xl md:text-2xl text-[#00478f] text-center">Añadir categoría al proceso</h3>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-2 mt-2 w-full">
        <select
          className="px-4 py-2 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base min-w-[160px] bg-blue-50 shadow transition disabled:bg-gray-100 disabled:text-gray-400 font-semibold hover:border-blue-400 text-center"
          value={selectedCategoryId}
          onChange={e => setSelectedCategoryId(e.target.value)}
          disabled={loading || !categoriesNotInProcess?.length}
        >
          <option value="" hidden>Seleccione una categoría</option>
          {categoriesNotInProcess && categoriesNotInProcess.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button
          className="px-7 py-2 rounded-xl text-base font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition shadow-lg disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-green-300 active:scale-95"
          onClick={onAdd}
          disabled={loading || !categoriesNotInProcess?.length || !selectedCategoryId}
        >
          <span className="inline-flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Añadir
          </span>
        </button>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .max-w-2xl { max-width: 99vw !important; }
          .rounded-3xl { border-radius: 1.1rem !important; }
        }
        .animate-fadein { animation: fadein 0.2s; }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
