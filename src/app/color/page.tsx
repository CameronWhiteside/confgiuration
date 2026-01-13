import { convertColor } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { ColorForm } from "./form";

interface PageProps {
	searchParams: Promise<{
		hex?: string;
	}>;
}

const DEFAULT_HEX = "#8b5cf6";
const DEFAULT_RGB = { r: 139, g: 92, b: 246 };
const DEFAULT_HSL = { h: 263, s: 90, l: 66 };

export default async function ColorPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const inputHex = params.hex || "";

	// Process on server if input provided
	let hex = DEFAULT_HEX;
	let rgb = DEFAULT_RGB;
	let hsl = DEFAULT_HSL;

	if (inputHex) {
		const result = convertColor({ color: inputHex });
		if (result.success) {
			hex = result.data.hex;
			rgb = result.data.rgb;
			hsl = result.data.hsl;
		}
	}

	return (
		<ToolLayout toolId="color">
			<ColorForm initialHex={hex} initialRgb={rgb} initialHsl={hsl} />
		</ToolLayout>
	);
}
