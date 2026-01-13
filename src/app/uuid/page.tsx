import { generateUuid, type UuidVersion } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { UuidForm } from "./form";

interface PageProps {
	searchParams: Promise<{
		version?: string;
		count?: string;
	}>;
}

export default async function UuidPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const version = (params.version === "v7" ? "v7" : "v4") as UuidVersion;
	const count = params.count ? Math.min(Math.max(parseInt(params.count), 1), 100) : 1;

	let uuids: string[] = [];

	// Generate on server if explicitly requested via URL params
	if (params.count || params.version) {
		const result = generateUuid({ version, count });
		if (result.success) {
			uuids = result.data.uuids;
		}
	}

	return (
		<ToolLayout toolId="uuid">
			<UuidForm
				initialVersion={version}
				initialCount={count}
				initialUuids={uuids}
			/>
		</ToolLayout>
	);
}
