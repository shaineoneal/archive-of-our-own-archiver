export const VersionNumber = () => {
    const versionNumber = import.meta.env.NEXT_VERSION;
    return (
        <>
            <p id="versionNumber">
                { versionNumber }
            </p>
        </>
    );
};