import {
	type JsonFormatInput,
	type JsonOutput,
	type Result,
	ok,
	err,
} from "./types";

/**
 * Format or minify JSON
 */
export function formatJson(input: JsonFormatInput): Result<JsonOutput> {
	try {
		const parsed = JSON.parse(input.json);
		const result = input.minify
			? JSON.stringify(parsed)
			: JSON.stringify(parsed, null, input.indent ?? 2);

		return ok({ result, valid: true });
	} catch (e) {
		return err(e instanceof Error ? e.message : "Invalid JSON");
	}
}

/**
 * Validate JSON without formatting
 */
export function validateJson(json: string): Result<{ valid: boolean; parsed: unknown }> {
	try {
		const parsed = JSON.parse(json);
		return ok({ valid: true, parsed });
	} catch (e) {
		return err(e instanceof Error ? e.message : "Invalid JSON");
	}
}
