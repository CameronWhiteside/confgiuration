import { generateHash, type HashAlgorithm } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

interface HashGenerateBody {
	text: string;
	algorithm?: HashAlgorithm;
	allAlgorithms?: boolean;
}

export async function POST(req: Request) {
	const body = await parseBody<HashGenerateBody>(req);

	if (!body?.text && body?.text !== "") {
		return errorResponse("text is required", 400);
	}

	// Validate algorithm if provided
	const validAlgorithms: HashAlgorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
	if (body.algorithm && !validAlgorithms.includes(body.algorithm)) {
		return errorResponse("algorithm must be SHA-1, SHA-256, SHA-384, or SHA-512", 400);
	}

	const result = await generateHash({
		text: body.text,
		algorithm: body.algorithm,
		allAlgorithms: body.allAlgorithms,
	});

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
