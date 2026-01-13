import { renderMarkdown } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { MarkdownForm } from "./form";

const SAMPLE_MARKDOWN = `# Welcome to Markdown Preview

This is a **simple** markdown editor with _live preview_.

## Features

- Real-time preview
- Basic syntax support
- Clean interface

### Code Example

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

> This is a blockquote

Visit [confgiuration](/) for more tools.

---

**Bold**, *italic*, and \`inline code\` are supported.
`;

interface PageProps {
	searchParams: Promise<{
		input?: string;
	}>;
}

export default async function MarkdownPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const input = params.input || "";

	// Use sample markdown if no input provided
	const markdownText = input || SAMPLE_MARKDOWN;

	// Process on server
	const serviceResult = renderMarkdown({ markdown: markdownText });
	const html = serviceResult.success ? serviceResult.data.html : "";

	return (
		<ToolLayout toolId="markdown">
			<MarkdownForm initialInput={input} initialHtml={html} />
		</ToolLayout>
	);
}
