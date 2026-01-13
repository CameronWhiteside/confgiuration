import { testRegex } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { RegexForm } from "./form";

interface Match {
	match: string;
	index: number;
	groups?: Record<string, string>;
}

interface PageProps {
	searchParams: Promise<{
		pattern?: string;
		flags?: string;
		text?: string;
	}>;
}

export default async function RegexPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const pattern = params.pattern || "";
	const flags = params.flags || "g";
	const text = params.text || "";

	// Process on server if input provided
	let matches: Match[] = [];
	let error: string | null = null;

	if (pattern && text) {
		const serviceResult = testRegex({ pattern, flags, text });

		if (serviceResult.success) {
			matches = serviceResult.data.matches;
		} else {
			error = serviceResult.error;
		}
	}

	return (
		<ToolLayout toolId="regex">
			<RegexForm
				initialPattern={pattern}
				initialFlags={flags}
				initialText={text}
				initialMatches={matches}
				initialError={error}
			/>
		</ToolLayout>
	);
}
