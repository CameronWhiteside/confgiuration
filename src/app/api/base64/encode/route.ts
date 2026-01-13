import { encodeBase64 } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function POST(req: Request) {
	const body = await parseBody<{ text: string; urlSafe?: boolean }>(req);

	if (!body?.text && body?.text !== "") {
		return errorResponse("text is required", 400);
	}

	const result = encodeBase64({ text: body.text, urlSafe: body.urlSafe });

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
