import PropTypes from "prop-types";

/**
 * DetailsActions component
 *
 * Renders action buttons for editing, enabling, or disabling a process or category entity.
 * Disables buttons while an action is loading.
 *
 * Props:
 *   - data: (object) Entity data (expects isActive boolean)
 *   - actionLoading: (boolean) Whether an action is in progress
 *   - onEdit: (function) Handler for edit action
 *   - onDisable: (function) Handler for disable action
 *   - onEnable: (function) Handler for enable action
 */
export function DetailsActions({ data, actionLoading, onEdit, onDisable, onEnable }) {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-end mt-4 mb-4 px-4 w-full min-w-0">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold w-full md:w-auto min-w-0"
        onClick={onEdit}
        disabled={actionLoading}
      >
        ✏️ Editar
      </button>
      {data.isActive ? (
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold w-full md:w-auto min-w-0"
          onClick={onDisable}
          disabled={actionLoading}
        >
          🚫 Deshabilitar
        </button>
      ) : (
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold w-full md:w-auto min-w-0"
          onClick={onEnable}
          disabled={actionLoading}
        >
          ✔️ Habilitar
        </button>
      )}
    </div>
  );
}

DetailsActions.propTypes = {
  data: PropTypes.shape({
    isActive: PropTypes.bool.isRequired,
  }).isRequired,
  actionLoading: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDisable: PropTypes.func.isRequired,
  onEnable: PropTypes.func.isRequired,
};
