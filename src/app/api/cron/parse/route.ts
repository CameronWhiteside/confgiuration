import { parseCron } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function POST(req: Request) {
	const body = await parseBody<{ expression: string }>(req);

	if (!body?.expression) {
		return errorResponse("expression is required", 400);
	}

	const result = parseCron({ expression: body.expression });

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
