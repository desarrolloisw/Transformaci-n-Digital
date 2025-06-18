import { NotResults } from "../notFound/NotResults.jsx";
import { CardChatbotConfig } from "./CardChatbotConfig.jsx";
import { getGridClass } from "../../libs/functions.lib.js";
import { useGetProcesses } from "../../api/process.api";
import { Search } from "../ui/Search";
import { useState } from "react";
import { CreateBtn } from "../ui/CreateBtn";
import { CreateModal } from "../ui/CreateModal";
import { useCreateModal } from "../../libs/useCreateModal.js";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateProcess } from "../../api/process.api";
import { getUserId } from "../../api/auth.api";
import { Toast } from "../ui/Toast";

export function Process() {
  const [search, setSearch] = useState("");
  const { data: processes = [], isLoading, isError } = useGetProcesses(search ? { search } : {});
  const createModal = useCreateModal();
  const queryClient = useQueryClient();
  const createProcess = useCreateProcess();

  const userId =  getUserId();

  const [modalKey, setModalKey] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const processFields = [
    { name: "name", label: "Nombre", type: "text", required: true, minLength: 2, maxLength: 100 },
    { name: "description", label: "Descripción", type: "textarea", required: true, minLength: 2 },
    { name: "isActive", label: "Activo", type: "checkbox", required: false },
  ];

  const handleCloseModal = () => {
    createModal.handleClose();
    setModalKey((k) => k + 1);
  };

  const handleCreateProcess = (form) => {
    const payload = {
      ...form,
      isActive: typeof form.isActive === 'boolean' ? form.isActive : true,
      userId,
    };
    createProcess.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(["processes"]);
        setToast({ show: true, message: "Proceso creado exitosamente", type: "success" });
        handleCloseModal();
      },
      onError: (error) => {
        const msg = error.response?.data?.message || "Error al crear proceso";
        setToast({ show: true, message: msg, type: "error" });
        createModal.setError(msg);
      },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#00478f] mb-4 text-center md:text-left">Listado de Procesos</h2>
        <div className="mb-6 max-w-2xl mx-auto flex flex-col md:flex-row gap-2 md:gap-4 items-center">
          <div className="flex-1 w-full">
            <Search value={search} onChange={setSearch} placeholder="Buscar proceso..." />
          </div>
          <div className="w-full md:w-auto">
            <CreateBtn onClick={createModal.handleOpen} label="Crear proceso" />
          </div>
        </div>
        <div className="relative w-full">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-32">
              <span className="text-gray-500 font-semibold">Cargando procesos...</span>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center w-full h-full place-items-center">
              <NotResults notResultsName={"Processes"} />
            </div>
          ) : processes.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full place-items-center">
              <NotResults notResultsName={"Processes"} />
            </div>
          ) : (
            <div className={`${getGridClass(processes)} w-full`}>
              {processes.map((proc) => (
                <CardChatbotConfig key={proc.id} data={proc} url="process" />
              ))}
            </div>
          )}
        </div>
        <CreateModal
          key={modalKey}
          open={createModal.open}
          onClose={handleCloseModal}
          onSubmit={handleCreateProcess}
          fields={processFields}
          title="Crear proceso"
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