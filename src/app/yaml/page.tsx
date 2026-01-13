import { yamlToJson, jsonToYaml } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { YamlForm } from "./form";

interface PageProps {
	searchParams: Promise<{
		mode?: string;
		input?: string;
	}>;
}

export default async function YamlPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const mode = (params.mode === "json-to-yaml" ? "json-to-yaml" : "yaml-to-json") as "yaml-to-json" | "json-to-yaml";
	const input = params.input || "";

	let result: string | null = null;
	let error: string | null = null;

	if (input) {
		const serviceResult = mode === "yaml-to-json"
			? yamlToJson({ yaml: input })
			: jsonToYaml({ json: input });

		if (serviceResult.success) {
			result = serviceResult.data.result;
		} else {
			error = serviceResult.error;
		}
	}

	return (
		<ToolLayout toolId="yaml">
			<YamlForm
				initialMode={mode}
				initialInput={input}
				initialOutput={result}
				initialError={error}
			/>
		</ToolLayout>
	);
}
