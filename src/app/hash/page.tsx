import { generateHash, type HashAlgorithm } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { HashForm } from "./form";

interface PageProps {
	searchParams: Promise<{
		text?: string;
	}>;
}

export default async function HashPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const text = params.text || "";

	let hashes: Record<string, string> | null = null;
	let error: string | null = null;

	if (text) {
		const result = await generateHash({ text, allAlgorithms: true });
		if (result.success) {
			hashes = result.data.hashes;
		} else {
			error = result.error;
		}
	}

	return (
		<ToolLayout toolId="hash">
			<HashForm
				initialText={text}
				initialHashes={hashes}
				initialError={error}
			/>
		</ToolLayout>
	);
}
