/**
 * NotResults component
 *
 * Displays a message indicating that no results were found for a given entity type.
 *
 * Props:
 *   - notResultsName: (string) The name of the entity type (e.g., 'Users', 'Categories')
 */

export const NotResults = ({ notResultsName }) => {
  return (
    <div className="not-found mt-4">
      <h1 className="text-black text-3xl">No {notResultsName} Found</h1>
      <p className="text-black text-2xl">
        Please try a different search or create a new {notResultsName}.
      </p>
    </div>
  );
};