/**
 * Parse a numeric value from a number or a formatted string.
 * Removes commas, trims whitespace, and falls back when parsing fails.
 *
 * @param value - Input to parse.
 * @param fallback - Value to return if parsing fails.
 * @returns The parsed integer or the fallback.
 */
export const parseNumber = (value: unknown, fallback = 0): number => {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string") {
        const cleaned = value.replace(/,/g, "").trim();
        const parsed = parseInt(cleaned || "0", 10);
        return Number.isFinite(parsed) ? parsed : fallback;
    }
    return fallback;
};

/**
 * Parse a JSON string into a typed value with a safe fallback.
 *
 * @typeParam T - Expected output type.
 * @param value - Input to parse as JSON.
 * @param fallback - Value to return if parsing fails.
 * @returns The parsed JSON value or the fallback.
 */
export const parseJson = <T>(value: unknown, fallback: T): T => {
    if (typeof value !== "string") {
        return fallback;
    }
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
};

/**
 * Parse a delimited string into a trimmed string array.
 * Empty or non-string values return the provided fallback.
 *
 * @param value - Input to split.
 * @param delimiter - Delimiter used for splitting.
 * @param fallback - Value to return if input is empty or invalid.
 * @returns A list of non-empty, trimmed strings.
 */
export const parseList = (value: unknown, delimiter = ",", fallback: string[] = []): string[] => {
    if (typeof value !== "string" || !value.trim()) {
        return fallback;
    }
    return value
        .split(delimiter)
        .map((item) => item.trim())
        .filter(Boolean);
};

/**
 * Parse a boolean from a boolean or string value.
 * Accepts "true"/"false" (case-insensitive) and falls back otherwise.
 *
 * @param value - Input to parse.
 * @param fallback - Value to return if parsing fails.
 * @returns The parsed boolean or the fallback.
 */
export const parseBoolean = (value: unknown, fallback = false): boolean => {
    if (typeof value === "boolean") {
        return value;
    }
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (normalized === "true") return true;
        if (normalized === "false") return false;
    }
    return fallback;
};

/**
 * Normalize a work ID into a string.
 * Numbers are converted and strings are trimmed; other values become "".
 *
 * @param value - Input to normalize.
 * @returns A normalized work ID string (or empty string).
 */
export const normalizeWorkId = (value: unknown): string => {
    if (typeof value === "number") {
        return value.toString();
    }
    if (typeof value === "string") {
        return value.trim();
    }
    return "";
};