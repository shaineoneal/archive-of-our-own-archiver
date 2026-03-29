/**
 * Generates a high-entropy random string for the code_verifier.
 */
export function generateRandomString(length = 64) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (dec) => ("0" + dec.toString(16)).substr(-2)).join("");
}