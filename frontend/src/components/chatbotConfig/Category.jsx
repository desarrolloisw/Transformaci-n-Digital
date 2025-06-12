import { NotResults } from "../notFound/NotResults.jsx";
import { CardChatbotConfig } from "./CardChatbotConfig.jsx";
import { getGridClass } from "../../libs/functions.lib.js";
import { useGetCategories } from "../../api/category.api.js";

export function Categories() {
  const { data: categories = [], isLoading, isError } = useGetCategories();

  return (
    <div className="container mx-auto p-4">
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#00478f] mb-4 text-center md:text-left">Listado de Categorías</h2>
        <div className={`${getGridClass(categories)} w-full`}>
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-32">
              <span className="text-gray-500 font-semibold">Cargando categorías...</span>
            </div>
          ) : isError ? (
            <NotResults notResultsName={"Categories"} />
          ) : categories.length === 0 ? (
            <NotResults notResultsName={"Categories"} />
          ) : (
            categories.map((cate) => (
              <CardChatbotConfig key={cate.id} data={cate} url="category" />
            ))
          )}
        </div>
      </section>
    </div>
  );
}