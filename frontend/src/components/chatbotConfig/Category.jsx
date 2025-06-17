import { NotResults } from "../notFound/NotResults.jsx";
import { CardChatbotConfig } from "./CardChatbotConfig.jsx";
import { getGridClass } from "../../libs/functions.lib.js";
import { useGetCategories } from "../../api/category.api.js";
import { Search } from "../ui/Search";
import { useState } from "react";

export function Categories() {
  const [search, setSearch] = useState("");
  const { data: categories = [], isLoading, isError } = useGetCategories(search ? { search } : {});

  return (
    <div className="container mx-auto p-4">
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#00478f] mb-4 text-center md:text-left">Listado de Categorías</h2>
        <div className="mb-6 max-w-md mx-auto">
          <Search value={search} onChange={setSearch} placeholder="Buscar categoría..." />
        </div>
        <div className="relative w-full">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-32">
              <span className="text-gray-500 font-semibold">Cargando categorías...</span>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center w-full h-full place-items-center">
              <NotResults notResultsName={"Categories"} />
            </div>
          ) : categories.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full place-items-center">
              <NotResults notResultsName={"Categories"} />
            </div>
          ) : (
            <div className={`${getGridClass(categories)} w-full`}>
              {categories.map((cate) => (
                <CardChatbotConfig key={cate.id} data={cate} url="category" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}