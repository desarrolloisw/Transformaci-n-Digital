export default function ProcessCategoryAdd({ categoriesNotInProcess, loading, onAdd, selectedCategoryId, setSelectedCategoryId }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-2 bg-white rounded-xl shadow border border-gray-200 p-4 flex flex-col gap-2">
      <h3 className="font-semibold text-lg md:text-xl text-[#00478f] mb-2">Añadir categoría al proceso</h3>
      <div className="flex gap-3 flex-wrap items-center mb-2 mt-2">
        <select
          className="input px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base min-w-[160px]"
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
          className="btn btn-success px-5 py-2 rounded-md text-base font-semibold bg-green-600 hover:bg-green-700 text-white transition"
          onClick={onAdd}
          disabled={loading || !categoriesNotInProcess?.length}
        >
          Añadir
        </button>
      </div>
    </div>
  );
}
