import { NotResults } from "../notFound/NotResults.jsx";
import { CardChatbotConfig } from "./CardChatbotConfig.jsx";
import { getGridClass } from "../../libs/functions.lib.js";

export function Categories() {
  // Mock data for processes and counts
  const categories = [
    {
      id: 1,
      name: "Información General",
      isActive: true,
      createdAt: "2023-10-01T12:00:00Z"
    },
    {
      id: 2,
      name: "Requisitos",
      isActive: false,
      createdAt: "2023-10-02T12:00:00Z"
    },
    {
      id: 3,
      name: "Documentación",
      isActive: true,
      createdAt: "2023-10-03T12:00:00Z"
    },
    {
      id: 4,
      name: "Graduación",
      isActive: true,
      createdAt: "2023-10-04T12:00:00Z"
    },
    {
      id: 5,
      name: "Contacto con el coordinador",
      isActive: false,
      createdAt: "2023-10-05T12:00:00Z"
    }
  ];

  return (
        <div className="container mx-auto p-4">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#00478f] mb-4 text-center md:text-left">Listado de Categorías</h2>
            <div className={`${getGridClass(categories)} w-full`}>
              {categories.length === 0 ? (
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