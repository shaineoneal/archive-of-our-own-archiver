import { base64urlEncode } from "@/utils";

/**
 * Hashes the verifier using SHA-256 to create the challenge.
 */
export async function deriveChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return base64urlEncode(hash);
}