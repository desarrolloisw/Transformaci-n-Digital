/**
 * Categories component
 *
 * Displays a list of categories with search, creation modal, and toast notifications.
 * Handles category creation, error/success feedback, and responsive card layout.
 *
 * Features:
 *   - Search/filter categories
 *   - Create new category via modal form
 *   - Shows loading, error, and empty states
 *   - Displays toast notifications for success/error
 */

import { NotResults } from "../notFound/NotResults.jsx";
import { CardChatbotConfig } from "./CardChatbotConfig.jsx";
import { useGetCategories } from "../../api/category.api.js";
import { Search } from "../ui/Search";
import { useState } from "react";
import { CreateBtn } from "../ui/CreateBtn";
import { CreateModal } from "../ui/CreateModal";
import { useCreateModal } from "../../libs/useCreateModal.js";
import { useCreateCategory } from "../../api/category.api";
import { useQueryClient } from "@tanstack/react-query";
import { getUserId } from "../../api/auth.api.js";
import { Toast } from "../ui/Toast";

export function Categories() {
  const [search, setSearch] = useState("");
  const { data: categories = [], isLoading, isError } = useGetCategories(search ? { search } : {});
  const createModal = useCreateModal();
  const queryClient = useQueryClient();
  const createCategory = useCreateCategory();

  const userId =  getUserId();

  const [modalKey, setModalKey] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const categoryFields = [
    { name: "name", label: "Nombre", type: "text", required: true, minLength: 2, maxLength: 100 },
    { name: "description", label: "Descripción", type: "textarea", required: true, minLength: 2 },
    { name: "isActive", label: "Activo", type: "checkbox", required: false },
  ];

  const handleCloseModal = () => {
    createModal.handleClose();
    setModalKey((k) => k + 1);
  };

  const handleCreateCategory = (form) => {
    const payload = {
      ...form,
      userId,
      isActive: typeof form.isActive === 'boolean' ? form.isActive : true,
    };
    createCategory.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
        setToast({ show: true, message: "Categoría creada exitosamente", type: "success" });
        handleCloseModal();
      },
      onError: (error) => {
        const msg = error.response?.data?.message || "Error al crear categoría";
        setToast({ show: true, message: msg, type: "error" });
        createModal.setError(msg);
      },
    });
  };

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <section className="mb-6 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-[#00478f] mb-3 sm:mb-4 text-center md:text-left">Listado de Categorías</h2>
        <div className="mb-4 sm:mb-6 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 sm:gap-4 items-center w-full">
          <div className="flex-1 w-full">
            <Search value={search} onChange={setSearch} placeholder="Buscar categoría..." />
          </div>
          <div className="w-full sm:w-auto">
            <CreateBtn onClick={createModal.handleOpen} label="Crear categoría" className="w-full sm:w-auto" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {categories.map((cate) => (
                <CardChatbotConfig key={cate.id} data={cate} url="category" />
              ))}
            </div>
          )}
        </div>
        <CreateModal
          key={modalKey}
          open={createModal.open}
          onClose={handleCloseModal}
          onSubmit={handleCreateCategory}
          fields={categoryFields}
          title="Crear categoría"
          error={createModal.error}
        />
        {toast.show && (
          <Toast
            message={toast.message}
            onClose={() => setToast(t => ({ ...t, show: false }))}
            type={toast.type}
          />
        )}
      </section>
    </div>
  );
}