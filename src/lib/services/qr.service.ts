import QRCode from "qrcode";
import {
	type QrGenerateInput,
	type QrOutput,
	type Result,
	ok,
	err,
} from "./types";

/**
 * Generate QR code
 */
export async function generateQr(input: QrGenerateInput): Promise<Result<QrOutput>> {
	try {
		const options: QRCode.QRCodeToDataURLOptions = {
			width: input.size ?? 256,
			margin: 2,
			errorCorrectionLevel: input.errorCorrection ?? "M",
			color: {
				dark: input.darkColor ?? "#18181b",
				light: input.lightColor ?? "#ffffff",
			},
		};

		const format = input.format ?? "png";

		let data: string;

		if (format === "svg") {
			data = await QRCode.toString(input.text, {
				type: "svg",
				width: options.width,
				margin: options.margin,
				errorCorrectionLevel: options.errorCorrectionLevel,
				color: options.color,
			});
		} else {
			// PNG as base64 data URL
			data = await QRCode.toDataURL(input.text, options);
		}

		return ok({ data, format });
	} catch (e) {
		return err(e instanceof Error ? e.message : "Failed to generate QR code");
	}
}

/**
 * Generate QR code as Buffer (for direct image response)
 */
export async function generateQrBuffer(input: QrGenerateInput): Promise<Result<Buffer>> {
	try {
		const options: QRCode.QRCodeToBufferOptions = {
			width: input.size ?? 256,
			margin: 2,
			errorCorrectionLevel: input.errorCorrection ?? "M",
			color: {
				dark: input.darkColor ?? "#18181b",
				light: input.lightColor ?? "#ffffff",
			},
		};

		const buffer = await QRCode.toBuffer(input.text, options);
		return ok(buffer);
	} catch (e) {
		return err(e instanceof Error ? e.message : "Failed to generate QR code");
	}
}
