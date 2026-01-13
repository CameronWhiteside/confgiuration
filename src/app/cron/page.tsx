import { parseCron } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { CronForm } from "./form";
import type { CronOutput } from "@/lib/services";

interface PageProps {
	searchParams: Promise<{
		expression?: string;
	}>;
}

export default async function CronPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const expression = params.expression || "0 9 * * 1-5";

	let result: CronOutput | null = null;

	if (expression) {
		const serviceResult = parseCron({ expression });
		if (serviceResult.success) {
			result = serviceResult.data;
		}
	}

	return (
		<ToolLayout toolId="cron">
			<CronForm
				initialExpression={expression}
				initialResult={result}
			/>
		</ToolLayout>
	);
}
