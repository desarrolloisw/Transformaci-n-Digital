/**
 * Custom React hook for managing the state and logic of a modal dialog.
 * Provides open/close state, error handling, and utility functions for modal control.
 *
 * @returns {Object} Modal state and handlers:
 *   - open: boolean indicating if the modal is open
 *   - setOpen: function to set open state
 *   - error: string for error messages
 *   - setError: function to set error message
 *   - handleOpen: function to open the modal
 *   - handleClose: function to close the modal and clear errors
 */
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
