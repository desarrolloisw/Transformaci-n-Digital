import PropTypes from "prop-types";
import { useState } from "react";
import { useUpdateCategory, useDisableCategory, useEnableCategory } from "../../api/category.api";
import { useUpdateProcess, useDisableProcess, useEnableProcess } from "../../api/process.api";
import { EditDetailsForm } from "./details/EditDetailsForm";
import { DetailsHeader } from "./details/DetailsHeader";
import { DetailsInfo } from "./details/DetailsInfo";
import { DetailsActions } from "./details/DetailsActions";

export function Details({ data, type, refetch, setToast }) {
  const [editMode, setEditMode] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mutations
  const updateCategory = useUpdateCategory();
  const disableCategory = useDisableCategory();
  const enableCategory = useEnableCategory();
  const updateProcess = useUpdateProcess();
  const disableProcess = useDisableProcess();
  const enableProcess = useEnableProcess();

  if (!data) {
    return (
      <div className="text-center text-gray-500 font-semibold py-10">
        No se encontró información.
      </div>
    );
  }

  // Handlers
  const handleEdit = () => setEditMode(true);
  const handleCancel = () => setEditMode(false);

  const handleSave = async (form) => {
    setActionLoading(true);
    setError(null);
    try {
      let result;
      if (type === "category") {
        result = await updateCategory.mutateAsync({ id: data.id, ...form });
      } else {
        result = await updateProcess.mutateAsync({ id: data.id, data: form });
      }
      setEditMode(false);
      refetch?.();
      if (result && result.noChanges) {
        if (setToast) setToast({ show: true, message: "No hubo cambios para guardar", type: "info" });
      } else {
        if (setToast) setToast({ show: true, message: "Guardado exitosamente", type: "success" });
      }
    } catch (e) {
      const msg = e?.response?.data?.message || "Error al guardar cambios";
      setError(msg);
      if (setToast) setToast({ show: true, message: msg, type: "error" });
    } finally {
      setActionLoading(false);
    }
  };
  const handleDisable = async () => {
    setActionLoading(true);
    setError(null);
    try {
      if (type === "category") {
        await disableCategory.mutateAsync({ id: data.id, userId: data.userId });
      } else {
        await disableProcess.mutateAsync({ id: data.id, userId: data.userId });
      }
      refetch?.();
      if (setToast) setToast({ show: true, message: "Deshabilitado exitosamente", type: "success" });
    } catch (e) {
      const msg = e?.response?.data?.message || "Error al deshabilitar";
      setError(msg);
      if (setToast) setToast({ show: true, message: msg, type: "error" });
    } finally {
      setActionLoading(false);
    }
  };
  const handleEnable = async () => {
    setActionLoading(true);
    setError(null);
    try {
      if (type === "category") {
        await enableCategory.mutateAsync({ id: data.id, userId: data.userId });
      } else {
        await enableProcess.mutateAsync({ id: data.id, userId: data.userId });
      }
      refetch?.();
      if (setToast) setToast({ show: true, message: "Habilitado exitosamente", type: "success" });
    } catch (e) {
      const msg = e?.response?.data?.message || "Error al habilitar";
      setError(msg);
      if (setToast) setToast({ show: true, message: msg, type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <DetailsHeader type={type} error={error} />
      {editMode ? (
        <EditDetailsForm data={data} onCancel={handleCancel} onSave={handleSave} />
      ) : (
        <>
          <DetailsInfo data={data} />
          <DetailsActions
            data={data}
            actionLoading={actionLoading}
            onEdit={handleEdit}
            onDisable={handleDisable}
            onEnable={handleEnable}
          />
        </>
      )}
    </div>
  );
}

Details.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    userId: PropTypes.number,
  }),
  type: PropTypes.oneOf(["process", "category"]).isRequired,
  refetch: PropTypes.func,
  setToast: PropTypes.func,
};
