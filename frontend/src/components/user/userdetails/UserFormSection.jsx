// Sección de formulario reutilizable para campos de usuario
export default function UserFormSection({ title, children, onSubmit, className = "", ...props }) {
  return (
    <form onSubmit={onSubmit} className={`bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-3 border border-blue-100 ${className}`} {...props}>
      {title && <label className="font-semibold text-base sm:text-lg mb-1">{title}</label>}
      {children}
    </form>
  );
}
