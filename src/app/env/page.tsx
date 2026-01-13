import { envToJson, jsonToEnv } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { EnvForm } from "./form";

interface PageProps {
	searchParams: Promise<{
		mode?: string;
		input?: string;
	}>;
}

export default async function EnvPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const mode = (params.mode === "json-to-env" ? "json-to-env" : "env-to-json") as "env-to-json" | "json-to-env";
	const input = params.input || "";

	let result: string | null = null;
	let error: string | null = null;

	if (input) {
		const serviceResult = mode === "env-to-json"
			? envToJson({ env: input })
			: jsonToEnv({ json: input });

		if (serviceResult.success) {
			result = serviceResult.data.result;
		} else {
			error = serviceResult.error;
		}
	}

	return (
		<ToolLayout toolId="env">
			<EnvForm
				initialMode={mode}
				initialInput={input}
				initialOutput={result}
				initialError={error}
			/>
		</ToolLayout>
	);
}
