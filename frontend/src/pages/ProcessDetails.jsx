import { useParams } from "react-router-dom";
import { useGetProcess } from "../api/process.api";
import { Details } from "../components/chatbotConfig/Details";
import { Toast } from "../components/ui/Toast";
import { useState } from "react";
import { getUserId } from "../api/auth.api";
import ProcessCategoriesDetails from "../components/chatbotConfig/ProcessCategoriesDetails";

/**
 * ProcessDetails page displays the details of a single process.
 * Fetches process data by ID from the URL params and shows loading, error, or details view.
 * Also renders the categories associated with the process and handles Toast notifications.
 */
export function ProcessDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetProcess(id);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Show loading state while fetching process
  if (isLoading) {
    return <div className="text-center py-10 text-gray-500 font-semibold">Cargando proceso...</div>;
  }
  // Show error state if fetch fails or no data
  if (isError || !data) {
    return <div className="text-center py-10 text-red-500 font-semibold">No se pudo cargar el proceso.</div>;
  }

  const userId = getUserId();

  // Render process details, associated categories, and Toast notifications
  return (
    <div className="process-details">
      <Details data={data} type="process" setToast={setToast} />
      <div style={{ marginTop: 32 }}>
        <ProcessCategoriesDetails processId={Number(id)} userId={userId || undefined} />
      </div>
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