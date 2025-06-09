export const NotResults = ({notResultsName}) => {
    return (
        <div className="not-found mt-4">
            <h1 className="text-white text-3xl">No {notResultsName} Found</h1>
            <p className="text-white text-2xl">Please try a different search or create a new {notResultsName}.</p>
        </div>
    );
}