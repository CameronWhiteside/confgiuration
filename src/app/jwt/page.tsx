import { decodeJwt } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { JwtForm } from "./form";
import type { JwtOutput } from "@/lib/services";

interface PageProps {
	searchParams: Promise<{
		token?: string;
	}>;
}

export default async function JwtPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const token = params.token || "";

	let result: JwtOutput | null = null;
	let error: string | null = null;

	if (token) {
		const serviceResult = decodeJwt({ token });

		if (serviceResult.success) {
			result = serviceResult.data;
		} else {
			error = serviceResult.error;
		}
	}

	return (
		<ToolLayout toolId="jwt">
			<JwtForm
				initialToken={token}
				initialResult={result}
				initialError={error}
			/>
		</ToolLayout>
	);
}
