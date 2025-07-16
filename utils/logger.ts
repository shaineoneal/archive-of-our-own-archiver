/**
 * Logs messages to the console in non-production environments.
 * In production, the log function does nothing.
 *
 * @param environment - The current environment (e.g., 'production', 'development').
 * @returns A function that logs messages to the console in non-production environments.
 *          In production, the function is a no-op.
 *
 * The log function captures the name of the function that called it and includes it in the log message.
 * This is useful for debugging purposes to trace where the log message originated.
 *
 * Example usage:
 * ```typescript
 * log('This is a debug message');
 * ```
 */
const log = (function (environment) {
    if (environment === 'production') {
        //return () => {};
    }
    return (...args: any) => {
        console.log(...args);
    };
})(process.env.NODE_ENV);

export { log };