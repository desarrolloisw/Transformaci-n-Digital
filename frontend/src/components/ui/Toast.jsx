// Toast mejorado y responsivo
// filepath: c:\Users\fofap\Desktop\Transformacion Digital\frontend\src\components\ui\Toast.jsx
export function Toast({ message, onClose, type = "info" }) {
  const typeStyles = {
    error: "bg-red-600 text-white",
    success: "bg-green-600 text-white",
    info: "bg-blue-600 text-white",
  };
  const typeLabels = {
    error: "Error:",
    success: "Éxito:",
    info: "Info:",
  };
  return (
    <div
      className={`fixed bottom-4 right-4 left-4 sm:left-auto z-50 max-w-xs w-full sm:max-w-sm px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in ${typeStyles[type] || typeStyles.info}`}
      style={{ minWidth: "200px" }}
    >
      <span className="font-bold">{typeLabels[type] || typeLabels.info}</span>
      <span className="flex-1 break-words">{message}</span>
      <button className="ml-2 text-white font-bold" onClick={onClose} aria-label="Cerrar">✕</button>
    </div>
  );
}