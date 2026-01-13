import { convertBase } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { BaseForm } from "./form";

type Base = "binary" | "octal" | "decimal" | "hex";

const RADIX_TO_BASE: Record<string, Base> = {
	"2": "binary",
	"8": "octal",
	"10": "decimal",
	"16": "hex",
};

interface PageProps {
	searchParams: Promise<{
		input?: string;
		fromBase?: string;
	}>;
}

export default async function BasePage({ searchParams }: PageProps) {
	const params = await searchParams;
	const input = params.input || "";
	const fromBaseRadix = params.fromBase || "10";
	const fromBase: Base = RADIX_TO_BASE[fromBaseRadix] || "decimal";
	const radix = parseInt(fromBaseRadix, 10) as 2 | 8 | 10 | 16;

	// Process on server if input provided
	let result: { binary: string; octal: string; decimal: string; hex: string } | null = null;
	let error: string | null = null;

	if (input) {
		const serviceResult = convertBase({ value: input, fromBase: radix });

		if (serviceResult.success) {
			result = serviceResult.data;
		} else {
			error = serviceResult.error;
		}
	}

	return (
		<ToolLayout toolId="base">
			<BaseForm
				initialInput={input}
				initialFromBase={fromBase}
				initialResult={result}
				initialError={error}
			/>
		</ToolLayout>
	);
}
