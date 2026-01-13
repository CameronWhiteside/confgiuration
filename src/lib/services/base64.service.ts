import {
	type Base64EncodeInput,
	type Base64DecodeInput,
	type Base64Output,
	type Result,
	ok,
	err,
} from "./types";

/**
 * Encode text to Base64
 */
export function encodeBase64(input: Base64EncodeInput): Result<Base64Output> {
	try {
		const bytes = new TextEncoder().encode(input.text);
		const binary = Array.from(bytes)
			.map((b) => String.fromCharCode(b))
			.join("");

		let result = btoa(binary);

		// Convert to URL-safe Base64 if requested
		if (input.urlSafe) {
			result = result.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
		}

		return ok({ result });
	} catch (e) {
		return err(e instanceof Error ? e.message : "Encoding failed");
	}
}

/**
 * Decode Base64 to text
 */
export function decodeBase64(input: Base64DecodeInput): Result<Base64Output> {
	try {
		let base64 = input.base64;

		// Convert from URL-safe Base64 if needed
		if (input.urlSafe) {
			base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
			// Add padding if needed
			const padding = (4 - (base64.length % 4)) % 4;
			base64 += "=".repeat(padding);
		}

		const binary = atob(base64);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i);
		}

		const result = new TextDecoder().decode(bytes);
		return ok({ result });
	} catch {
		return err("Invalid Base64 string");
	}
}
