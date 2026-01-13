import {
	type RegexTestInput,
	type RegexOutput,
	type RegexMatch,
	type Result,
	ok,
	err,
} from "./types";

/**
 * Test a regex pattern against text
 */
export function testRegex(input: RegexTestInput): Result<RegexOutput> {
	try {
		const flags = input.flags ?? "g";
		const regex = new RegExp(input.pattern, flags);
		const matches: RegexMatch[] = [];

		if (flags.includes("g")) {
			let match;
			while ((match = regex.exec(input.text)) !== null) {
				matches.push({
					match: match[0],
					index: match.index,
					groups: match.groups,
				});
				// Prevent infinite loop on zero-width matches
				if (match[0].length === 0) {
					regex.lastIndex++;
				}
			}
		} else {
			const match = regex.exec(input.text);
			if (match) {
				matches.push({
					match: match[0],
					index: match.index,
					groups: match.groups,
				});
			}
		}

		return ok({
			isValid: true,
			matches,
			matchCount: matches.length,
		});
	} catch (e) {
		return err(e instanceof Error ? e.message : "Invalid regex pattern");
	}
}

/**
 * Validate a regex pattern without testing
 */
export function validateRegex(pattern: string, flags?: string): Result<{ valid: boolean }> {
	try {
		new RegExp(pattern, flags);
		return ok({ valid: true });
	} catch (e) {
		return err(e instanceof Error ? e.message : "Invalid regex pattern");
	}
}
