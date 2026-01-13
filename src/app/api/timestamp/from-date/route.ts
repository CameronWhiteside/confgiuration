import { dateToTimestamp } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

interface DateToTimestampBody {
	date: string;
	milliseconds?: boolean;
}

export async function POST(req: Request) {
	const body = await parseBody<DateToTimestampBody>(req);

	if (!body?.date) {
		return errorResponse("date is required (ISO 8601 format)", 400);
	}

	const result = dateToTimestamp({
		date: body.date,
		milliseconds: body.milliseconds,
	});

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
