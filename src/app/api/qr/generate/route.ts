import { generateQr, generateQrBuffer, type QrFormat, type QrErrorCorrection } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

interface QrRequestBody {
	text: string;
	format?: QrFormat;
	size?: number;
	errorCorrection?: QrErrorCorrection;
	darkColor?: string;
	lightColor?: string;
}

export async function POST(req: Request) {
	const body = await parseBody<QrRequestBody>(req);

	if (!body?.text) {
		return errorResponse("text is required", 400);
	}

	// If format is png and client wants binary image response
	const acceptHeader = req.headers.get("Accept") || "";
	const wantsBinary = acceptHeader.includes("image/png") && body.format !== "svg";

	if (wantsBinary) {
		const result = await generateQrBuffer({
			text: body.text,
			size: body.size,
			errorCorrection: body.errorCorrection,
			darkColor: body.darkColor,
			lightColor: body.lightColor,
		});

		if (!result.success) {
			return errorResponse(result.error, 400);
		}

		// Convert Buffer to Uint8Array for Response compatibility
		return new Response(new Uint8Array(result.data), {
			headers: {
				"Content-Type": "image/png",
				"Cache-Control": "public, max-age=31536000",
			},
		});
	}

	// Return as JSON with data URL or SVG string
	const result = await generateQr({
		text: body.text,
		format: body.format,
		size: body.size,
		errorCorrection: body.errorCorrection,
		darkColor: body.darkColor,
		lightColor: body.lightColor,
	});

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
