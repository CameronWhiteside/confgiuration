import { validateRegex } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

interface RegexValidateBody {
	pattern: string;
	flags?: string;
}

export async function POST(req: Request) {
	const body = await parseBody<RegexValidateBody>(req);

	if (!body?.pattern) {
		return errorResponse("pattern is required", 400);
	}

	const result = validateRegex(body.pattern, body.flags);

	if (!result.success) {
		return jsonResponse({ valid: false, error: result.error });
	}

	return jsonResponse({ valid: true });
}
