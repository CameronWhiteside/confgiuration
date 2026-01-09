"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";

// Simple markdown parser - handles basic syntax
function parseMarkdown(text: string): string {
	let html = text
		// Escape HTML
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		// Headers
		.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
		.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-2">$1</h2>')
		.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
		// Bold and Italic
		.replace(/\*\*\*(.*?)\*\*\*/gim, "<strong><em>$1</em></strong>")
		.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
		.replace(/\*(.*?)\*/gim, "<em>$1</em>")
		.replace(/___(.*?)___/gim, "<strong><em>$1</em></strong>")
		.replace(/__(.*?)__/gim, "<strong>$1</strong>")
		.replace(/_(.*?)_/gim, "<em>$1</em>")
		// Strikethrough
		.replace(/~~(.*?)~~/gim, "<del>$1</del>")
		// Code blocks
		.replace(/```(\w*)\n([\s\S]*?)```/gim, '<pre class="bg-gray-100 p-3 rounded-lg my-3 overflow-x-auto"><code>$2</code></pre>')
		// Inline code
		.replace(/`([^`]+)`/gim, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm">$1</code>')
		// Blockquotes
		.replace(/^&gt; (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 my-3 text-foreground-muted">$1</blockquote>')
		// Unordered lists
		.replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
		.replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
		// Ordered lists
		.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
		// Horizontal rule
		.replace(/^---$/gim, '<hr class="my-6 border-border">')
		// Links
		.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary underline hover:no-underline">$1</a>')
		// Images
		.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-3">')
		// Paragraphs (double newlines)
		.replace(/\n\n/gim, '</p><p class="my-3">')
		// Single newlines to <br>
		.replace(/\n/gim, "<br>");

	// Wrap in paragraph if not starting with block element
	if (!html.startsWith("<h") && !html.startsWith("<pre") && !html.startsWith("<blockquote") && !html.startsWith("<ul") && !html.startsWith("<ol")) {
		html = '<p class="my-3">' + html + "</p>";
	}

	return html;
}

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

export default function MarkdownPage() {
	const [input, setInput] = useState(SAMPLE_MARKDOWN);

	const html = useMemo(() => parseMarkdown(input), [input]);

	return (
		<ToolLayout toolId="markdown">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Editor */}
				<div>
					<div className="flex items-center justify-between mb-2">
						<label className="block text-sm font-medium text-foreground-muted">
							Markdown
						</label>
						<CopyButton text={input} variant="ghost" />
					</div>
					<Textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type your markdown here..."
						className="min-h-[500px] font-mono text-sm"
					/>
				</div>

				{/* Preview */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.1 }}
				>
					<div className="flex items-center justify-between mb-2">
						<label className="block text-sm font-medium text-foreground-muted">
							Preview
						</label>
						<CopyButton text={html} variant="ghost" />
					</div>
					<Card hover={false} className="min-h-[500px] overflow-auto">
						<article
							className="prose prose-sm max-w-none text-foreground"
							dangerouslySetInnerHTML={{ __html: html }}
						/>
					</Card>
				</motion.div>
			</div>
		</ToolLayout>
	);
}
