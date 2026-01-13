import { envToJson } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function POST(req: Request) {
	const body = await parseBody<{ env: string }>(req);

	if (!body?.env && body?.env !== "") {
		return errorResponse("env is required", 400);
	}

	const result = envToJson({ env: body.env });

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
