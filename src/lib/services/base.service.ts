import {
	type BaseConvertInput,
	type BaseConvertOutput,
	type NumberBase,
	type Result,
	ok,
	err,
} from "./types";

const BASE_PATTERNS: Record<NumberBase, RegExp> = {
	2: /^[01]+$/,
	8: /^[0-7]+$/,
	10: /^[0-9]+$/,
	16: /^[0-9a-fA-F]+$/,
};

/**
 * Convert number between different bases
 */
export function convertBase(input: BaseConvertInput): Result<BaseConvertOutput> {
	const { value, fromBase } = input;

	if (!value.trim()) {
		return err("Value is required");
	}

	// Remove common prefixes
	const cleanValue = value.replace(/^(0b|0o|0x)/i, "").trim();

	// Validate input against expected pattern
	const pattern = BASE_PATTERNS[fromBase];
	if (!pattern.test(cleanValue)) {
		const baseNames: Record<NumberBase, string> = {
			2: "binary",
			8: "octal",
			10: "decimal",
			16: "hexadecimal",
		};
		return err(`Invalid ${baseNames[fromBase]} number`);
	}

	try {
		const decimal = parseInt(cleanValue, fromBase);
		if (isNaN(decimal) || decimal < 0) {
			return err("Invalid number");
		}

		return ok({
			binary: decimal.toString(2),
			octal: decimal.toString(8),
			decimal: decimal.toString(10),
			hex: decimal.toString(16).toUpperCase(),
		});
	} catch {
		return err("Conversion failed");
	}
}
