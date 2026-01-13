import { compareDiff } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

interface DiffCompareBody {
	text1: string;
	text2: string;
}

export async function POST(req: Request) {
	const body = await parseBody<DiffCompareBody>(req);

	if (body?.text1 === undefined || body?.text1 === null) {
		return errorResponse("text1 is required", 400);
	}

	if (body?.text2 === undefined || body?.text2 === null) {
		return errorResponse("text2 is required", 400);
	}

	const result = compareDiff({
		text1: body.text1,
		text2: body.text2,
	});

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
