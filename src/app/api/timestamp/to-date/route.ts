import { timestampToDate } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

interface TimestampToDateBody {
	timestamp: number;
	milliseconds?: boolean;
}

export async function POST(req: Request) {
	const body = await parseBody<TimestampToDateBody>(req);

	if (body?.timestamp === undefined || body?.timestamp === null) {
		return errorResponse("timestamp is required", 400);
	}

	if (typeof body.timestamp !== "number" || isNaN(body.timestamp)) {
		return errorResponse("timestamp must be a valid number", 400);
	}

	const result = timestampToDate({
		timestamp: body.timestamp,
		milliseconds: body.milliseconds,
	});

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
