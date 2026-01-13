"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";

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

interface MarkdownFormProps {
	initialInput: string;
	initialHtml: string;
}

export function MarkdownForm({ initialInput, initialHtml }: MarkdownFormProps) {
	const [input, setInput] = useState(initialInput || SAMPLE_MARKDOWN);
	const [html, setHtml] = useState(initialHtml);
	const [isPending, startTransition] = useTransition();

	const handleInputChange = (value: string) => {
		setInput(value);

		startTransition(async () => {
			try {
				const res = await fetch("/api/markdown/render", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ markdown: value }),
				});

				const data = await res.json() as { success: boolean; data?: { html: string } };

				if (data.success && data.data) {
					setHtml(data.data.html);
				}
			} catch {
				// Keep existing HTML on error
			}
		});
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* Editor */}
			<div>
				<form method="GET" action="/markdown">
					<div className="flex items-center justify-between mb-2">
						<label className="block text-sm font-medium text-foreground-muted">
							Markdown
						</label>
						<CopyButton text={input} variant="ghost" />
					</div>
					<Textarea
						name="input"
						value={input}
						onChange={(e) => handleInputChange(e.target.value)}
						placeholder="Type your markdown here..."
						className="min-h-[500px] font-mono text-sm"
					/>
					<noscript>
						<button
							type="submit"
							className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
						>
							Render
						</button>
					</noscript>
				</form>
			</div>

			{/* Preview */}
			<div>
				<div className="flex items-center justify-between mb-2">
					<label className="block text-sm font-medium text-foreground-muted">
						Preview {isPending && <span className="text-xs">(updating...)</span>}
					</label>
					<CopyButton text={html} variant="ghost" />
				</div>
				<Card hover={false} className="min-h-[500px] overflow-auto">
					<article
						className="prose prose-sm max-w-none text-foreground"
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				</Card>
			</div>
		</div>
	);
}
