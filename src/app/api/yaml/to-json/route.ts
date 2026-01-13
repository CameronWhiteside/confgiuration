import { yamlToJson } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

interface YamlToJsonBody {
	yaml: string;
	indent?: number;
}

export async function POST(req: Request) {
	const body = await parseBody<YamlToJsonBody>(req);

	if (!body?.yaml && body?.yaml !== "") {
		return errorResponse("yaml is required", 400);
	}

	const result = yamlToJson({
		yaml: body.yaml,
		indent: body.indent,
	});

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
