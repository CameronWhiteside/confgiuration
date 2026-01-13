import {
	type MarkdownRenderInput,
	type MarkdownOutput,
	type Result,
	ok,
} from "./types";

/**
 * Simple markdown to HTML converter
 * Handles basic markdown syntax
 */
function parseMarkdown(text: string): string {
	let html = text
		// Escape HTML entities
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		// Headers
		.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
		.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-2">$1</h2>')
		.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
		// Bold and Italic combinations
		.replace(/\*\*\*(.*?)\*\*\*/gim, "<strong><em>$1</em></strong>")
		.replace(/___(.*?)___/gim, "<strong><em>$1</em></strong>")
		// Bold
		.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
		.replace(/__(.*?)__/gim, "<strong>$1</strong>")
		// Italic
		.replace(/\*(.*?)\*/gim, "<em>$1</em>")
		.replace(/_(.*?)_/gim, "<em>$1</em>")
		// Strikethrough
		.replace(/~~(.*?)~~/gim, "<del>$1</del>")
		// Code blocks (fenced)
		.replace(
			/```(\w*)\n([\s\S]*?)```/gim,
			'<pre class="bg-gray-100 p-3 rounded-lg my-3 overflow-x-auto"><code>$2</code></pre>'
		)
		// Inline code
		.replace(
			/`([^`]+)`/gim,
			'<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm">$1</code>'
		)
		// Blockquotes
		.replace(
			/^&gt; (.*$)/gim,
			'<blockquote class="border-l-4 border-primary pl-4 my-3 text-foreground-muted">$1</blockquote>'
		)
		// Unordered lists
		.replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
		.replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
		// Ordered lists
		.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
		// Horizontal rule
		.replace(/^---$/gim, '<hr class="my-6 border-border">')
		// Links
		.replace(
			/\[([^\]]+)\]\(([^)]+)\)/gim,
			'<a href="$2" class="text-primary underline hover:no-underline" rel="noopener">$1</a>'
		)
		// Images
		.replace(
			/!\[([^\]]*)\]\(([^)]+)\)/gim,
			'<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-3">'
		)
		// Paragraphs (double newlines)
		.replace(/\n\n/gim, '</p><p class="my-3">')
		// Single newlines to <br>
		.replace(/\n/gim, "<br>");

	// Wrap in paragraph if not starting with block element
	if (
		!html.startsWith("<h") &&
		!html.startsWith("<pre") &&
		!html.startsWith("<blockquote") &&
		!html.startsWith("<ul") &&
		!html.startsWith("<ol")
	) {
		html = '<p class="my-3">' + html + "</p>";
	}

	return html;
}

/**
 * Render markdown to HTML
 */
export function renderMarkdown(input: MarkdownRenderInput): Result<MarkdownOutput> {
	const html = parseMarkdown(input.markdown);

	// Note: For a production implementation, you'd want to use a proper
	// sanitization library like DOMPurify if sanitize option is true
	// For now, we escape HTML entities in the parseMarkdown function

	return ok({ html });
}
