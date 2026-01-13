import { renderMarkdown } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

interface MarkdownRenderBody {
	markdown: string;
}

export async function POST(req: Request) {
	const body = await parseBody<MarkdownRenderBody>(req);

	if (!body?.markdown && body?.markdown !== "") {
		return errorResponse("markdown is required", 400);
	}

	const result = renderMarkdown({ markdown: body.markdown });

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
