import { generatePassword } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { PasswordForm } from "./form";
import type { PasswordOutput } from "@/lib/services";

interface PageProps {
	searchParams: Promise<{
		length?: string;
		count?: string;
		uppercase?: string;
		lowercase?: string;
		numbers?: string;
		symbols?: string;
	}>;
}

export default async function PasswordPage({ searchParams }: PageProps) {
	const params = await searchParams;
	
	const length = params.length ? Math.min(128, Math.max(4, parseInt(params.length))) : 16;
	const count = params.count ? Math.min(20, Math.max(1, parseInt(params.count))) : 1;
	const uppercase = params.uppercase !== "false";
	const lowercase = params.lowercase !== "false";
	const numbers = params.numbers !== "false";
	const symbols = params.symbols !== "false";

	let result: PasswordOutput | null = null;

	// Generate on server if explicitly requested via URL params
	if (params.length || params.count) {
		const serviceResult = generatePassword({
			length,
			count,
			uppercase,
			lowercase,
			numbers,
			symbols,
		});
		if (serviceResult.success) {
			result = serviceResult.data;
		}
	}

	return (
		<ToolLayout toolId="password">
			<PasswordForm
				initialLength={length}
				initialCount={count}
				initialUppercase={uppercase}
				initialLowercase={lowercase}
				initialNumbers={numbers}
				initialSymbols={symbols}
				initialResult={result}
			/>
		</ToolLayout>
	);
}
