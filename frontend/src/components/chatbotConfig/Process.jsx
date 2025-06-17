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

export function Process() {
  const [search, setSearch] = useState("");
  const { data: processes = [], isLoading, isError } = useGetProcesses(search ? { search } : {});
  const createModal = useCreateModal();
  const queryClient = useQueryClient();
  const createProcess = useCreateProcess();

  // Get userId from localStorage (must be set at login)
  const userId = Number(localStorage.getItem("userId"));

  const processFields = [
    { name: "name", label: "Nombre", type: "text", required: true, minLength: 2, maxLength: 100 },
    { name: "description", label: "Descripción", type: "textarea", required: true, minLength: 2 },
    { name: "isActive", label: "Activo", type: "checkbox", required: false },
    // Hide userId from UI, but always send it
  ];

  const handleCreateProcess = (form) => {
    // Ensure isActive is always boolean and present, and userId is sent
    const payload = {
      ...form,
      isActive: typeof form.isActive === 'boolean' ? form.isActive : true,
      userId,
    };
    createProcess.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(["processes"]);
        createModal.handleClose();
      },
      onError: (error) => {
        createModal.setError(error.response?.data?.message || "Error al crear proceso");
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
          open={createModal.open}
          onClose={createModal.handleClose}
          onSubmit={handleCreateProcess}
          fields={processFields}
          title="Crear proceso"
          error={createModal.error}
        />
      </section>
    </div>
  );
}