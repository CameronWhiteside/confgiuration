import { generateLorem, type LoremType } from "@/lib/services";
import { jsonResponse, errorResponse, parseSearchParams, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function GET(req: Request) {
	const params = parseSearchParams(req.url, {
		type: "paragraphs" as LoremType,
		count: 3,
	});

	// Validate type
	const validTypes: LoremType[] = ["words", "sentences", "paragraphs"];
	if (!validTypes.includes(params.type as LoremType)) {
		return errorResponse("type must be 'words', 'sentences', or 'paragraphs'", 400);
	}

	// Clamp count
	const count = Math.min(Math.max(params.count, 1), 100);

	const result = generateLorem({
		type: params.type as LoremType,
		count,
	});

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
