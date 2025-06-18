import { useParams } from "react-router-dom";
import { useGetCategory } from "../api/category.api";
import { Details } from "../components/chatbotConfig/Details";
import { Toast } from "../components/ui/Toast";
import { useState } from "react";

/**
 * CategoryDetails page displays the details of a single category.
 * Fetches category data by ID from the URL params and shows loading, error, or details view.
 * Also handles showing Toast notifications for actions performed in the Details component.
 */
export function CategoryDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetCategory(id);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Show loading state while fetching category
  if (isLoading) {
    return <div className="text-center py-10 text-gray-500 font-semibold">Cargando categoría...</div>;
  }
  // Show error state if fetch fails or no data
  if (isError || !data) {
    return <div className="text-center py-10 text-red-500 font-semibold">No se pudo cargar la categoría.</div>;
  }

  // Render category details and Toast notifications
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