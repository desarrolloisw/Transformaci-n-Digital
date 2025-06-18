import PropTypes from "prop-types";

/**
 * CreateBtn component
 *
 * Renders a styled button for triggering creation actions (e.g., opening a modal).
 *
 * Props:
 *   - onClick: (function) Callback to handle button click
 *   - label: (string) Button label text (default: 'Crear')
 */
export function CreateBtn({ onClick, label = "Crear" }) {
  return (
    <button
      className="bg-gradient-to-r from-[#b57714] via-[#f7c948] to-[#ffe066] hover:from-[#f7c948] hover:to-[#b57714] text-[#3a2c06] hover:text-[#00478f] font-bold py-2 px-4 rounded shadow w-full md:w-auto transition-colors duration-200"
      onClick={onClick}
      type="button"
    >
      ➕ {label}
    </button>
  );
}

CreateBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
};
