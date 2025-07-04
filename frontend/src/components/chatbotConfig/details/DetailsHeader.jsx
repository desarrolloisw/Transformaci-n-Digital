import PropTypes from "prop-types";
import { ReturnBtn } from "../../ui/ReturnBtn";

/**
 * DetailsHeader component
 *
 * Renders the header section for process or category details pages.
 * Includes a return button, title, and optional error message.
 *
 * Props:
 *   - type: (string) 'process' or 'category' (determines title and return path)
 *   - error: (string) Optional error message to display
 */

export function DetailsHeader({ type, error }) {
  return (
    <div className="px-4 mb-4">
      <div className="mb-6">
        <ReturnBtn to={type === "process" ? "/chatbot-config" : "/chatbot-config/categories"} />
      </div>
      <h2 className="text-3xl md:text-4xl font-extrabold text-[#00478f] mb-6 text-center drop-shadow-sm">
        {type === "process" ? "Detalle del Proceso" : "Detalle de la Categoría"}
      </h2>
      {error && <div className="text-red-500 text-center font-semibold mb-4">{error}</div>}
    </div>
  );
}

DetailsHeader.propTypes = {
  type: PropTypes.oneOf(["process", "category"]).isRequired,
  error: PropTypes.string,
};
