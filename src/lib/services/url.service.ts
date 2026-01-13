import {
	type UrlEncodeInput,
	type UrlDecodeInput,
	type UrlOutput,
	type Result,
	ok,
	err,
} from "./types";

/**
 * Encode text for use in URLs
 */
export function encodeUrl(input: UrlEncodeInput): Result<UrlOutput> {
	try {
		const result =
			input.encodeComponent !== false
				? encodeURIComponent(input.text)
				: encodeURI(input.text);
		return ok({ result });
	} catch (e) {
		return err(e instanceof Error ? e.message : "Encoding failed");
	}
}

/**
 * Decode URL-encoded text
 */
export function decodeUrl(input: UrlDecodeInput): Result<UrlOutput> {
	try {
		const result =
			input.decodeComponent !== false
				? decodeURIComponent(input.url)
				: decodeURI(input.url);
		return ok({ result });
	} catch (e) {
		return err(e instanceof Error ? e.message : "Decoding failed");
	}
}
