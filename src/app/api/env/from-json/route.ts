import { jsonToEnv } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function POST(req: Request) {
	const body = await parseBody<{ json: string }>(req);

	if (!body?.json && body?.json !== "") {
		return errorResponse("json is required", 400);
	}

	const result = jsonToEnv({ json: body.json });

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
