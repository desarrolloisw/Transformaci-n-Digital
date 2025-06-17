import { NotResults } from "../notFound/NotResults.jsx";
import { CardChatbotConfig } from "./CardChatbotConfig.jsx";
import { getGridClass } from "../../libs/functions.lib.js";
import { useGetCategories } from "../../api/category.api.js";
import { Search } from "../ui/Search";
import { useState } from "react";
import { CreateBtn } from "../ui/CreateBtn";
import { CreateModal } from "../ui/CreateModal";
import { useCreateModal } from "../../libs/useCreateModal.js";
import { useCreateCategory } from "../../api/category.api";
import { useQueryClient } from "@tanstack/react-query";

export function Categories() {
  const [search, setSearch] = useState("");
  const { data: categories = [], isLoading, isError } = useGetCategories(search ? { search } : {});
  const createModal = useCreateModal();
  const queryClient = useQueryClient();
  const createCategory = useCreateCategory();

  // Get userId from localStorage (must be set at login)
  const userId = Number(localStorage.getItem("userId"));

  const categoryFields = [
    { name: "name", label: "Nombre", type: "text", required: true, minLength: 2, maxLength: 100 },
    { name: "description", label: "Descripción", type: "textarea", required: true, minLength: 2 },
    { name: "isActive", label: "Activo", type: "checkbox", required: false },
    // Hide userId from UI, but always send it
  ];

  const handleCreateCategory = (form) => {
    // Ensure userId is a number and isActive is boolean (default true)
    const payload = {
      ...form,
      userId,
      isActive: typeof form.isActive === 'boolean' ? form.isActive : true,
    };
    createCategory.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
        createModal.handleClose();
      },
      onError: (error) => {
        createModal.setError(error.response?.data?.message || "Error al crear categoría");
      },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#00478f] mb-4 text-center md:text-left">Listado de Categorías</h2>
        <div className="mb-6 max-w-2xl mx-auto flex flex-col md:flex-row gap-2 md:gap-4 items-center">
          <div className="flex-1 w-full">
            <Search value={search} onChange={setSearch} placeholder="Buscar categoría..." />
          </div>
          <div className="w-full md:w-auto">
            <CreateBtn onClick={createModal.handleOpen} label="Crear categoría" />
          </div>
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
        <CreateModal
          open={createModal.open}
          onClose={createModal.handleClose}
          onSubmit={handleCreateCategory}
          fields={categoryFields}
          title="Crear categoría"
          error={createModal.error}
        />
      </section>
    </div>
  );
}