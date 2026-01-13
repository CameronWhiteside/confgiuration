import { decodeJwt } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function POST(req: Request) {
	const body = await parseBody<{ token: string }>(req);

	if (!body?.token) {
		return errorResponse("token is required", 400);
	}

	const result = decodeJwt({ token: body.token });

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
