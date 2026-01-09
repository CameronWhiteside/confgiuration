import type { Metadata } from "next";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";

const toolId = "password";

export const metadata: Metadata = generateToolMetadata(toolId);

export default function ToolPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const jsonLd = generateToolJsonLd(toolId);

	return (
		<>
			{jsonLd?.map((schema, index) => (
				<script
					key={index}
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
				/>
			))}
			{children}
		</>
	);
}
