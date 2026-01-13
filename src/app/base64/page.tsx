import { encodeBase64, decodeBase64 } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Base64Form } from "./form";

interface PageProps {
	searchParams: Promise<{
		mode?: string;
		input?: string;
		urlSafe?: string;
	}>;
}

export default async function Base64Page({ searchParams }: PageProps) {
	const params = await searchParams;
	const mode = (params.mode === "decode" ? "decode" : "encode") as "encode" | "decode";
	const input = params.input || "";
	const urlSafe = params.urlSafe === "true";

	// Process on server if input provided
	let result: string | null = null;
	let error: string | null = null;

	if (input) {
		const serviceResult =
			mode === "encode"
				? encodeBase64({ text: input, urlSafe })
				: decodeBase64({ base64: input, urlSafe });

		if (serviceResult.success) {
			result = serviceResult.data.result;
		} else {
			error = serviceResult.error;
		}
	}

	return (
		<ToolLayout toolId="base64">
			<Base64Form
				initialMode={mode}
				initialInput={input}
				initialOutput={result}
				initialError={error}
				initialUrlSafe={urlSafe}
			/>
		</ToolLayout>
	);
}
