import { useParams } from "react-router-dom";
import { useGetProcess } from "../api/process.api";
import { Details } from "../components/chatbotConfig/Details";
import { Toast } from "../components/ui/Toast";
import { useState } from "react";

export function ProcessDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetProcess(id);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500 font-semibold">Cargando proceso...</div>;
  }
  if (isError || !data) {
    return <div className="text-center py-10 text-red-500 font-semibold">No se pudo cargar el proceso.</div>;
  }

  return (
    <div className="process-details">
      <Details data={data} type="process" setToast={setToast} />
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