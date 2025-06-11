export const NotResults = ({notResultsName}) => {
    return (
        <div className="not-found mt-4">
            <h1 className="text-black text-3xl">No {notResultsName} Found</h1>
            <p className="text-black text-2xl">Please try a different search or create a new {notResultsName}.</p>
        </div>
    );
}