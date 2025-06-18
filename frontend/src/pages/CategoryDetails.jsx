import { useParams } from "react-router-dom";
import { useGetCategory } from "../api/category.api";
import { Details } from "../components/chatbotConfig/Details";
import { Toast } from "../components/ui/Toast";
import { useState } from "react";

export function CategoryDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetCategory(id);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500 font-semibold">Cargando categoría...</div>;
  }
  if (isError || !data) {
    return <div className="text-center py-10 text-red-500 font-semibold">No se pudo cargar la categoría.</div>;
  }

  return (
    <div className="category-details">
      <Details data={data} type="category" setToast={setToast} />
      {toast.show && (
        <Toast
          message={toast.message}
          onClose={() => setToast(t => ({ ...t, show: false }))}
          type={toast.type}
        />
      )}
    </div>
  );
}