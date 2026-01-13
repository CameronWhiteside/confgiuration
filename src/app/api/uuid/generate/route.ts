import { generateUuid, type UuidVersion } from "@/lib/services";
import { jsonResponse, errorResponse, parseSearchParams, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

export async function GET(req: Request) {
	const params = parseSearchParams(req.url, {
		version: "v4" as UuidVersion,
		count: 1,
	});

	// Validate version
	if (params.version !== "v4" && params.version !== "v7") {
		return errorResponse("version must be 'v4' or 'v7'", 400);
	}

	// Validate count
	const count = Math.min(Math.max(params.count, 1), 100);

	const result = generateUuid({
		version: params.version,
		count,
	});

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
