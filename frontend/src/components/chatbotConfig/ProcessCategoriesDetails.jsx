import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCategoriesByProcess, useGetCategoriesNotInProcess } from "../../api/category.api";
import { getFaqByProcessAndCategory, useUpdateFaqResponse, useCreateFaq, useToggleFaqActive } from "../../api/faq.api";
import { Toast } from "../ui/Toast";
import RichTextModal from "../ui/RichTextModal";
import ProcessCategoryAdd from "./processcategories/ProcessCategoryAdd";
import ProcessCategoryList from "./processcategories/ProcessCategoryList";
import { getUserId } from "../../api/auth.api";

export default function ProcessCategoriesDetails({ processId, userId: userIdProp }) {
  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [modal, setModal] = useState({ open: false, category: null, response: "", isNew: false });
  const [toast, setToast] = useState({ open: false, type: "info", message: "" });
  const [loadingModal, setLoadingModal] = useState(false);
  const {
    data: categories,
    isLoading: loadingCategories,
    isError: errorCategories,
    error: errorCategoriesObj
  } = useGetCategoriesByProcess(processId);
  const {
    data: categoriesNotInProcess,
    isLoading: loadingNotInProcess,
  } = useGetCategoriesNotInProcess(processId);
  const [faqCache, setFaqCache] = useState({});
  const updateFaqMutation = useUpdateFaqResponse();
  const createFaqMutation = useCreateFaq();
  const toggleFaqActiveMutation = useToggleFaqActive();
  const userId = userIdProp ?? getUserId();

  // Handlers
  const handleEdit = async (category, isNew = false) => {
    setToast({ open: false });
    setLoadingModal(true);
    try {
      let response = isNew ? "" : faqCache[category.id];
      if (!isNew && !response) {
        const faq = await getFaqByProcessAndCategory(processId, category.id);
        response = faq.response;
        setFaqCache((prev) => ({ ...prev, [category.id]: response }));
      }
      setModal({ open: true, category, response, isNew });
    } catch (err) {
      setToast({ open: true, type: "error", message: err?.response?.data?.message || "No se pudo cargar la respuesta." });
    }
    setLoadingModal(false);
  };

  const handleAddCategory = () => {
    if (!selectedCategoryId) {
      setToast({ open: true, type: "info", message: "Seleccione una categoría para añadir." });
      return;
    }
    const category = categoriesNotInProcess?.find((c) => c.id === Number(selectedCategoryId));
    if (!category) return;
    handleEdit(category, true);
  };

  const handleModalSave = (newResponse) => {
    if (!newResponse.trim()) {
      setToast({ open: true, type: "info", message: "La respuesta no puede estar vacía." });
      return;
    }
    setLoadingModal(true);
    const { category, isNew, response: oldResponse } = modal;
    const mutation = isNew ? createFaqMutation : updateFaqMutation;
    if (!isNew && newResponse === oldResponse) {
      setToast({ open: true, type: "info", message: "No hay cambios para guardar." });
      setLoadingModal(false);
      return;
    }
    mutation.mutate(
      isNew
        ? { processId, categoryId: category.id, userId, response: newResponse }
        : { processId, categoryId: category.id, userId, response: newResponse },
      {
        onSuccess: (data) => {
          setToast({ open: true, type: "success", message: isNew ? "Respuesta registrada y categoría añadida." : "Respuesta actualizada correctamente." });
          setModal({ ...modal, open: false });
          queryClient.invalidateQueries(["categoriesByProcess", processId]);
          queryClient.invalidateQueries(["categoriesNotInProcess", processId]);
          setFaqCache((prev) => ({ ...prev, [category.id]: data.response }));
          setSelectedCategoryId("");
          setLoadingModal(false);
        },
        onError: (err) => {
          setToast({ open: true, type: "error", message: err?.response?.data?.message || (isNew ? "Error al añadir categoría." : "Error al actualizar respuesta.") });
          setLoadingModal(false);
        },
      }
    );
  };

  const handleToggleActive = (cat) => {
    if (!userId) {
      setToast({ open: true, type: "error", message: "No se encontró el usuario actual." });
      return;
    }
    toggleFaqActiveMutation.mutate(
      { processId, categoryId: cat.id, userId, isActive: !cat.isActive },
      {
        onSuccess: (data) => {
          setToast({ open: true, type: "success", message: data.isActive ? "FAQ activada" : "FAQ desactivada" });
          queryClient.invalidateQueries(["categoriesByProcess", processId]);
        },
        onError: (err) => {
          setToast({ open: true, type: "error", message: err?.response?.data?.message || "No se pudo cambiar el estado." });
        },
      }
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", width: "100%", maxWidth: 1000, margin: "0 auto", padding: "1.5rem 0.5rem 2.5rem 0.5rem" }}>
      <h2 className="text-2xl md:text-3xl font-bold text-[#00478f] mb-0 tracking-tight">Categorías del Proceso</h2>
      <ProcessCategoryAdd
        categoriesNotInProcess={categoriesNotInProcess}
        loading={loadingNotInProcess}
        onAdd={handleAddCategory}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
      />
      {loadingCategories ? (
        <div className="text-center text-gray-500 py-8 text-lg animate-pulse">Cargando categorías...</div>
      ) : errorCategories ? (
        <div className="text-center text-red-600 font-semibold py-6">
          Error al cargar categorías: {errorCategoriesObj?.response?.data?.message || errorCategoriesObj?.message || 'Error desconocido'}
        </div>
      ) : (
        <ProcessCategoryList
          categories={categories}
          onEdit={handleEdit}
          onToggleActive={handleToggleActive}
        />
      )}
      {modal.open && (
        <RichTextModal
          open={modal.open}
          initialHtml={modal.response}
          onClose={() => setModal({ ...modal, open: false })}
          onSave={handleModalSave}
          title={modal.category ? `${modal.isNew ? "Nueva respuesta para" : "Editar respuesta de"} ${modal.category.name}` : "Editar respuesta"}
          loading={loadingModal}
        />
      )}
      {(toast.open && toast.message) && (
        <Toast
          open={toast.open}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, open: false })}
          autoHideDuration={3500}
        />
      )}
    </div>
  );
}
