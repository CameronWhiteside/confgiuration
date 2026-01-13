import { compareDiff } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { DiffForm } from "./form";
import type { DiffOutput } from "@/lib/services";

interface PageProps {
	searchParams: Promise<{
		text1?: string;
		text2?: string;
	}>;
}

export default async function DiffPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const text1 = params.text1 || "";
	const text2 = params.text2 || "";

	let result: DiffOutput | null = null;

	if (text1 || text2) {
		const serviceResult = compareDiff({ text1, text2 });
		if (serviceResult.success) {
			result = serviceResult.data;
		}
	}

	return (
		<ToolLayout toolId="diff">
			<DiffForm
				initialText1={text1}
				initialText2={text2}
				initialResult={result}
			/>
		</ToolLayout>
	);
}
