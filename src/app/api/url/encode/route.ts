import { encodeUrl } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function POST(req: Request) {
	const body = await parseBody<{ text: string; encodeComponent?: boolean }>(req);

	if (!body?.text && body?.text !== "") {
		return errorResponse("text is required", 400);
	}

	const result = encodeUrl({ text: body.text, encodeComponent: body.encodeComponent });

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
