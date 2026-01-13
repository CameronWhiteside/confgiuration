import {
	type UuidGenerateInput,
	type UuidOutput,
	type Result,
	ok,
} from "./types";

/**
 * Generate UUID v4 (random)
 */
function generateUUIDv4(): string {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

/**
 * Generate UUID v7 (timestamp-based)
 */
function generateUUIDv7(): string {
	const timestamp = Date.now();
	const timestampHex = timestamp.toString(16).padStart(12, "0");

	const randomBytes = new Uint8Array(10);
	crypto.getRandomValues(randomBytes);

	// Set version to 7
	randomBytes[0] = (randomBytes[0] & 0x0f) | 0x70;
	// Set variant to RFC 4122
	randomBytes[2] = (randomBytes[2] & 0x3f) | 0x80;

	const randomHex = Array.from(randomBytes)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return `${timestampHex.slice(0, 8)}-${timestampHex.slice(8, 12)}-${randomHex.slice(0, 4)}-${randomHex.slice(4, 8)}-${randomHex.slice(8, 20)}`;
}

/**
 * Generate UUIDs
 */
export function generateUuid(input: UuidGenerateInput): Result<UuidOutput> {
	const count = Math.min(Math.max(input.count ?? 1, 1), 100);
	const generator = input.version === "v7" ? generateUUIDv7 : generateUUIDv4;

	const uuids: string[] = [];
	for (let i = 0; i < count; i++) {
		uuids.push(generator());
	}

	return ok({ uuids });
}
