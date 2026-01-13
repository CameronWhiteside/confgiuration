import {
	type HashGenerateInput,
	type HashOutput,
	type HashAlgorithm,
	type Result,
	ok,
	err,
} from "./types";

/**
 * Generate hash for text using specified algorithm
 */
async function hashText(text: string, algorithm: HashAlgorithm): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(text);
	const hashBuffer = await crypto.subtle.digest(algorithm, data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate hash(es) for text
 */
export async function generateHash(input: HashGenerateInput): Promise<Result<HashOutput>> {
	try {
		const hashes: Record<string, string> = {};

		if (input.allAlgorithms) {
			const algorithms: HashAlgorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
			for (const alg of algorithms) {
				hashes[alg] = await hashText(input.text, alg);
			}
		} else {
			const algorithm = input.algorithm ?? "SHA-256";
			hashes[algorithm] = await hashText(input.text, algorithm);
		}

		return ok({ hashes });
	} catch (e) {
		return err(e instanceof Error ? e.message : "Failed to generate hash");
	}
}
