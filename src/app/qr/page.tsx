import { generateQr } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { QrForm } from "./form";

interface PageProps {
	searchParams: Promise<{
		text?: string;
		size?: string;
	}>;
}

export default async function QrPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const text = params.text || "";
	const size = params.size ? parseInt(params.size) : 256;

	let qrData: string | null = null;
	let error: string | null = null;

	if (text) {
		const result = await generateQr({ text, size });
		if (result.success) {
			qrData = result.data.data;
		} else {
			error = result.error;
		}
	}

	return (
		<ToolLayout toolId="qr">
			<QrForm
				initialText={text}
				initialSize={size}
				initialQrData={qrData}
				initialError={error}
			/>
		</ToolLayout>
	);
}
