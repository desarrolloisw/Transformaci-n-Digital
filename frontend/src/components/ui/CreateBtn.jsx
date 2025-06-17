import PropTypes from "prop-types";

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
