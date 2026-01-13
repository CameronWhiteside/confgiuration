import { convertColor } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function POST(req: Request) {
	const body = await parseBody<{ color: string }>(req);

	if (!body?.color) {
		return errorResponse("color is required (hex, rgb, or hsl format)", 400);
	}

	const result = convertColor({ color: body.color });

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
