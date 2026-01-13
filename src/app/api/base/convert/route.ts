import { convertBase, type NumberBase } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

interface BaseConvertBody {
	value: string;
	fromBase: NumberBase;
	toBase?: NumberBase;
}

export async function POST(req: Request) {
	const body = await parseBody<BaseConvertBody>(req);

	if (!body?.value) {
		return errorResponse("value is required", 400);
	}

	if (!body.fromBase) {
		return errorResponse("fromBase is required (2, 8, 10, or 16)", 400);
	}

	const validBases: NumberBase[] = [2, 8, 10, 16];
	if (!validBases.includes(body.fromBase)) {
		return errorResponse("fromBase must be 2, 8, 10, or 16", 400);
	}

	const result = convertBase({
		value: body.value,
		fromBase: body.fromBase,
		toBase: body.toBase,
	});

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
