import { minifySql } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function POST(req: Request) {
	const body = await parseBody<{ sql: string }>(req);

	if (!body?.sql && body?.sql !== "") {
		return errorResponse("sql is required", 400);
	}

	const result = minifySql(body.sql);

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
