import {
	type EnvToJsonInput,
	type JsonToEnvInput,
	type EnvOutput,
	type Result,
	ok,
	err,
} from "./types";

/**
 * Parse .env file content to a key-value object
 */
function parseEnv(env: string): Record<string, string> {
	const result: Record<string, string> = {};
	const lines = env.split("\n");

	for (const line of lines) {
		const trimmed = line.trim();
		// Skip empty lines and comments
		if (!trimmed || trimmed.startsWith("#")) continue;

		const eqIndex = trimmed.indexOf("=");
		if (eqIndex === -1) continue;

		const key = trimmed.slice(0, eqIndex).trim();
		let value = trimmed.slice(eqIndex + 1).trim();

		// Remove quotes if present
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		result[key] = value;
	}

	return result;
}

/**
 * Convert object to .env file format
 */
function objectToEnv(obj: Record<string, unknown>): string {
	const lines: string[] = [];

	for (const [key, value] of Object.entries(obj)) {
		const strValue = String(value);
		// Quote values that contain special characters
		const needsQuotes =
			strValue.includes(" ") ||
			strValue.includes("=") ||
			strValue.includes("#") ||
			strValue.includes('"') ||
			strValue.includes("'");

		lines.push(`${key}=${needsQuotes ? `"${strValue}"` : strValue}`);
	}

	return lines.join("\n");
}

/**
 * Convert ENV format to JSON
 */
export function envToJson(input: EnvToJsonInput): Result<EnvOutput> {
	try {
		const parsed = parseEnv(input.env);
		const result = JSON.stringify(parsed, null, 2);
		return ok({ result });
	} catch (e) {
		return err(e instanceof Error ? e.message : "Invalid ENV format");
	}
}

/**
 * Convert JSON to ENV format
 */
export function jsonToEnv(input: JsonToEnvInput): Result<EnvOutput> {
	try {
		const parsed = JSON.parse(input.json);
		if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
			return err("JSON must be an object");
		}
		const result = objectToEnv(parsed as Record<string, unknown>);
		return ok({ result });
	} catch (e) {
		return err(e instanceof Error ? e.message : "Invalid JSON");
	}
}
