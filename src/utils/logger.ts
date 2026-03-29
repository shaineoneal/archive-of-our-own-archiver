/**
 * Simple console logger with log levels and environment-aware behavior.
 *
 * In development (`import.meta.env.PROD === false`), all levels (`debug`, `info`, `warn`, `error`)
 * are logged to the console with level-specific styling.
 *
 * In production (`import.meta.env.PROD === true`), `debug` and `info` messages are suppressed,
 * while `warn` and `error` messages are still logged.
 *
 * Use the default exported `logger` instance:
 *
 * Example usage:
 * ```typescript
 * import { logger } from "./utils/logger";
 *
 * logger.debug("Fetching works from AO3", { page });
 * logger.info("Archive completed");
 * logger.warn("Retrying request after rate limit");
 * logger.error("Failed to fetch work", error);
 * ```
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const COLORS: Record<LogLevel, string> = {
    debug: "color: DodgerBlue; font-weight: bold;",
    info:  "color: MediumSeaGreen; font-weight: bold;",
    warn:  "color: Gold; font-weight: bold;",
    error: "color: Red; font-weight: bold;",
};

const isProd = import.meta.env.PROD;

function createLogger() {
    function log(level: LogLevel): (...args: unknown[]) => void {
        // Only log debug and info when in development mode
        //if (isProd && (level === "debug" || level === "info")) return () => {};

        const color = COLORS[level];
        const prefix = `%c[${level.toUpperCase()}]`;

        switch (level) {
            case "debug": return console.debug.bind(console, prefix, color);
            case "info": return console.info.bind(console, prefix, color);
            case "warn":  return console.warn.bind(console, prefix, color);
            case "error": return console.error.bind(console, prefix, color);
        }
    }

    return {
        debug: log("debug"),
        info:  log("info"),
        warn:  log("warn"),
        error: log("error"),
    };
}

export type { LogLevel };

// Default logger — outputs all levels in development, and only warn/error in production}
export const logger = createLogger();
