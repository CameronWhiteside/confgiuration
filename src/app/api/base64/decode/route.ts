import { decodeBase64 } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function POST(req: Request) {
	const body = await parseBody<{ base64: string; urlSafe?: boolean }>(req);

	if (!body?.base64 && body?.base64 !== "") {
		return errorResponse("base64 is required", 400);
	}

	const result = decodeBase64({ base64: body.base64, urlSafe: body.urlSafe });

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
