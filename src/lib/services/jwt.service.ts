import {
	type JwtDecodeInput,
	type JwtOutput,
	type Result,
	ok,
	err,
} from "./types";

/**
 * Decode base64url to string
 */
function base64UrlDecode(str: string): string {
	// Convert base64url to standard base64
	const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
	// Add padding if needed
	const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
	return atob(padded);
}

/**
 * Decode a JWT token without verifying the signature
 */
export function decodeJwt(input: JwtDecodeInput): Result<JwtOutput> {
	try {
		const parts = input.token.trim().split(".");

		if (parts.length !== 3) {
			return err("Invalid JWT format - must have 3 parts separated by dots");
		}

		const header = JSON.parse(base64UrlDecode(parts[0]));
		const payload = JSON.parse(base64UrlDecode(parts[1]));
		const signature = parts[2];

		// Check expiration
		let isExpired: boolean | undefined;
		let expiresAt: string | undefined;

		if (typeof payload.exp === "number") {
			const expDate = new Date(payload.exp * 1000);
			isExpired = expDate < new Date();
			expiresAt = expDate.toISOString();
		}

		return ok({
			header,
			payload,
			signature,
			isExpired,
			expiresAt,
		});
	} catch (e) {
		return err(e instanceof Error ? e.message : "Failed to decode JWT");
	}
}
