import {
	type PasswordGenerateInput,
	type PasswordOutput,
	type Result,
	ok,
	err,
} from "./types";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS = "l1IO0";

/**
 * Generate a single password
 */
function generateSinglePassword(
	length: number,
	charset: string
): string {
	const array = new Uint32Array(length);
	crypto.getRandomValues(array);

	return Array.from(array)
		.map((n) => charset[n % charset.length])
		.join("");
}

/**
 * Calculate password strength
 */
function calculateStrength(
	length: number,
	options: PasswordGenerateInput
): PasswordOutput["strength"] {
	let score = 0;
	if (length >= 8) score += 1;
	if (length >= 12) score += 1;
	if (length >= 16) score += 1;
	if (options.lowercase && options.uppercase) score += 1;
	if (options.numbers) score += 1;
	if (options.symbols) score += 1;

	const maxScore = Math.min(score, 5);
	const strengths: PasswordOutput["strength"][] = [
		"weak",
		"weak",
		"medium",
		"medium",
		"strong",
		"very-strong",
	];
	return strengths[maxScore];
}

/**
 * Generate secure passwords
 */
export function generatePassword(input: PasswordGenerateInput): Result<PasswordOutput> {
	const length = Math.min(Math.max(input.length ?? 16, 4), 128);
	const count = Math.min(Math.max(input.count ?? 1, 1), 20);

	// Build charset
	let charset = "";
	if (input.lowercase !== false) charset += LOWERCASE;
	if (input.uppercase !== false) charset += UPPERCASE;
	if (input.numbers !== false) charset += NUMBERS;
	if (input.symbols) charset += SYMBOLS;

	// Remove ambiguous characters if requested
	if (input.excludeAmbiguous) {
		for (const char of AMBIGUOUS) {
			charset = charset.replace(char, "");
		}
	}

	if (!charset) {
		return err("At least one character type must be selected");
	}

	const passwords: string[] = [];
	for (let i = 0; i < count; i++) {
		passwords.push(generateSinglePassword(length, charset));
	}

	const strength = calculateStrength(length, input);

	return ok({ passwords, strength });
}
