import { formatJson } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

interface JsonFormatBody {
	json: string;
	indent?: number;
	minify?: boolean;
}

export async function POST(req: Request) {
	const body = await parseBody<JsonFormatBody>(req);

	if (!body?.json && body?.json !== "") {
		return errorResponse("json is required", 400);
	}

	const result = formatJson({
		json: body.json,
		indent: body.indent,
		minify: body.minify,
	});

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
