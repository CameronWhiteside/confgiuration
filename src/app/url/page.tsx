import { encodeUrl, decodeUrl } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { UrlForm } from "./form";

interface PageProps {
	searchParams: Promise<{
		mode?: string;
		input?: string;
		component?: string;
	}>;
}

export default async function UrlPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const mode = (params.mode === "decode" ? "decode" : "encode") as "encode" | "decode";
	const input = params.input || "";
	const encodeComponent = params.component !== "false";

	let result: string | null = null;
	let error: string | null = null;

	if (input) {
		const serviceResult =
			mode === "encode"
				? encodeUrl({ text: input, encodeComponent })
				: decodeUrl({ url: input, decodeComponent: encodeComponent });

		if (serviceResult.success) {
			result = serviceResult.data.result;
		} else {
			error = serviceResult.error;
		}
	}

	return (
		<ToolLayout toolId="url">
			<UrlForm
				initialMode={mode}
				initialInput={input}
				initialOutput={result}
				initialError={error}
				initialEncodeComponent={encodeComponent}
			/>
		</ToolLayout>
	);
}
