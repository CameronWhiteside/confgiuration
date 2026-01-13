import { jsonToYaml } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

interface JsonToYamlBody {
	json: string;
	indent?: number;
}

export async function POST(req: Request) {
	const body = await parseBody<JsonToYamlBody>(req);

	if (!body?.json && body?.json !== "") {
		return errorResponse("json is required", 400);
	}

	const result = jsonToYaml({
		json: body.json,
		indent: body.indent,
	});

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
