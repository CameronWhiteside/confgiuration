import { generateLorem, type LoremType } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { LoremForm } from "./form";

interface PageProps {
	searchParams: Promise<{
		type?: string;
		count?: string;
	}>;
}

export default async function LoremPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const type = (params.type === "words" || params.type === "sentences" ? params.type : "paragraphs") as LoremType;
	const count = params.count ? Math.min(100, Math.max(1, parseInt(params.count))) : 3;

	let result: string | null = null;

	// Generate on server if explicitly requested via URL params
	if (params.count || params.type) {
		const serviceResult = generateLorem({ type, count });
		if (serviceResult.success) {
			result = serviceResult.data.result;
		}
	}

	return (
		<ToolLayout toolId="lorem">
			<LoremForm
				initialType={type}
				initialCount={count}
				initialResult={result}
			/>
		</ToolLayout>
	);
}
