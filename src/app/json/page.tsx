import { formatJson } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { JsonForm } from "./form";

interface PageProps {
	searchParams: Promise<{
		input?: string;
		indent?: string;
		minify?: string;
	}>;
}

export default async function JsonPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const input = params.input || "";
	const indent = params.indent ? parseInt(params.indent) : 2;
	const minify = params.minify === "true";

	let result: string | null = null;
	let error: string | null = null;

	if (input) {
		const serviceResult = formatJson({ json: input, indent, minify });
		if (serviceResult.success) {
			result = serviceResult.data.result;
		} else {
			error = serviceResult.error;
		}
	}

	return (
		<ToolLayout toolId="json">
			<JsonForm
				initialInput={input}
				initialOutput={result}
				initialError={error}
				initialIndent={indent}
			/>
		</ToolLayout>
	);
}
