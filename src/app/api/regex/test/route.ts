import { testRegex } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

interface RegexTestBody {
	pattern: string;
	text: string;
	flags?: string;
}

export async function POST(req: Request) {
	const body = await parseBody<RegexTestBody>(req);

	if (!body?.pattern) {
		return errorResponse("pattern is required", 400);
	}

	if (body?.text === undefined || body?.text === null) {
		return errorResponse("text is required", 400);
	}

	const result = testRegex({
		pattern: body.pattern,
		text: body.text,
		flags: body.flags,
	});

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
