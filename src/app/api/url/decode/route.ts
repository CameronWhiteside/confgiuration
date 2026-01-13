import { decodeUrl } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function POST(req: Request) {
	const body = await parseBody<{ url: string; decodeComponent?: boolean }>(req);

	if (!body?.url && body?.url !== "") {
		return errorResponse("url is required", 400);
	}

	const result = decodeUrl({ url: body.url, decodeComponent: body.decodeComponent });

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
