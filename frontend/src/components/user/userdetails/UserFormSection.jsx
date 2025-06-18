/**
 * UserFormSection
 *
 * A reusable, styled form section for user-related forms.
 * Renders an optional section title and any child form fields/content.
 *
 * Props:
 *   title (string): Optional section title displayed as a label.
 *   children (ReactNode): Form fields or content to render inside the section.
 *   onSubmit (function): Form submit handler.
 *   className (string): Additional CSS classes for the form container.
 *   ...props: Any other props passed to the <form> element.
 */
export default function UserFormSection({ title, children, onSubmit, className = "", ...props }) {
  return (
    <form onSubmit={onSubmit} className={`bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-3 border border-blue-100 ${className}`} {...props}>
      {title && <label className="font-semibold text-base sm:text-lg mb-1">{title}</label>}
      {children}
    </form>
  );
}
