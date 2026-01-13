import { generatePassword } from "@/lib/services";
import { jsonResponse, errorResponse, parseSearchParams, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function GET(req: Request) {
	const params = parseSearchParams(req.url, {
		length: 16,
		count: 1,
		uppercase: true,
		lowercase: true,
		numbers: true,
		symbols: true,
		excludeAmbiguous: false,
	});

	// Clamp values
	const length = Math.min(Math.max(params.length, 4), 128);
	const count = Math.min(Math.max(params.count, 1), 20);

	const result = generatePassword({
		length,
		count,
		uppercase: params.uppercase,
		lowercase: params.lowercase,
		numbers: params.numbers,
		symbols: params.symbols,
		excludeAmbiguous: params.excludeAmbiguous,
	});

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
