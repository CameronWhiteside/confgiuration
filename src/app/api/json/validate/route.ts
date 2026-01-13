import { validateJson } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function POST(req: Request) {
	const body = await parseBody<{ json: string }>(req);

	if (!body?.json && body?.json !== "") {
		return errorResponse("json is required", 400);
	}

	const result = validateJson(body.json);

	if (!result.success) {
		return jsonResponse({ valid: false, error: result.error });
	}

	return jsonResponse({ valid: true });
}
