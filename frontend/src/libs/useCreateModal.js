import { useState } from "react";

export function useCreateModal() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  return {
    open,
    setOpen,
    error,
    setError,
    handleOpen,
    handleClose,
  };
}
