import { getCurrentTimestamp } from "@/lib/services";
import { jsonResponse, errorResponse, parseSearchParams, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function GET(req: Request) {
	const params = parseSearchParams(req.url, {
		milliseconds: false,
	});

	const result = getCurrentTimestamp(params.milliseconds);

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
