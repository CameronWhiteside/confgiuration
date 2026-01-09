"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, Tag } from "lucide-react";
import { type Article } from "@/lib/content";
import { cn } from "@/lib/utils";

interface ToolArticlesProps {
	articles: Article[];
	toolName: string;
}

export function ToolArticles({ articles, toolName }: ToolArticlesProps) {
	const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

	if (articles.length === 0) return null;

	return (
		<section className="mt-16 pt-8 border-t border-border">
			<div className="flex items-center gap-3 mb-6">
				<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple/10 to-accent-pink/10">
					<BookOpen className="w-5 h-5 text-primary" />
				</div>
				<div>
					<h2 className="text-xl font-bold text-foreground">
						Learn More About {toolName}
					</h2>
					<p className="text-sm text-foreground-muted">
						{articles.length} article{articles.length !== 1 ? "s" : ""} to help you understand and use this tool effectively
					</p>
				</div>
			</div>

			<div className="space-y-4">
				{articles.map((article) => (
					<ArticleCard
						key={article.id}
						article={article}
						isExpanded={expandedArticle === article.id}
						onToggle={() =>
							setExpandedArticle(
								expandedArticle === article.id ? null : article.id
							)
						}
					/>
				))}
			</div>
		</section>
	);
}

interface ArticleCardProps {
	article: Article;
	isExpanded: boolean;
	onToggle: () => void;
}

function ArticleCard({ article, isExpanded, onToggle }: ArticleCardProps) {
	return (
		<motion.article
			layout
			className={cn(
				"rounded-xl border border-border bg-card overflow-hidden",
				"transition-shadow duration-200",
				isExpanded && "shadow-lg"
			)}
		>
			{/* Header - Always visible */}
			<button
				onClick={onToggle}
				className="w-full px-6 py-5 text-left flex items-start gap-4 hover:bg-background-secondary/50 transition-colors"
			>
				<div className="flex-1 min-w-0">
					<h3 className="font-semibold text-foreground text-lg mb-1">
						{article.title}
					</h3>
					<p className="text-sm text-foreground-muted line-clamp-2">
						{article.description}
					</p>
					<div className="flex flex-wrap gap-2 mt-3">
						{article.tags.map((tag) => (
							<span
								key={tag}
								className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-background-secondary text-foreground-muted"
							>
								<Tag className="w-3 h-3" />
								{tag}
							</span>
						))}
					</div>
				</div>
				<motion.div
					animate={{ rotate: isExpanded ? 180 : 0 }}
					transition={{ duration: 0.2 }}
					className="flex-shrink-0 mt-1"
				>
					<ChevronDown className="w-5 h-5 text-foreground-muted" />
				</motion.div>
			</button>

			{/* Content - Expandable */}
			<AnimatePresence initial={false}>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
					>
						<div className="px-6 pb-6 border-t border-border">
							<div className="pt-6 prose prose-sm max-w-none">
								<MarkdownContent content={article.content} />
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.article>
	);
}

// Simple markdown renderer for article content
function MarkdownContent({ content }: { content: string }) {
	// Parse markdown to HTML (simplified version)
	const html = parseMarkdown(content);

	return (
		<div
			className="article-content"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}

// Simplified markdown parser
function parseMarkdown(markdown: string): string {
	let html = markdown;

	// Code blocks (must be first to prevent other replacements inside)
	html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
		const language = lang || "plaintext";
		const escapedCode = escapeHtml(code.trim());
		return `<pre class="language-${language}"><code>${escapedCode}</code></pre>`;
	});

	// Inline code
	html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

	// Headers
	html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">$1</h3>');
	html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-8 mb-4 text-foreground">$1</h2>');

	// Bold
	html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

	// Italic
	html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

	// Tables
	html = html.replace(/^\|(.+)\|$/gm, (match) => {
		const cells = match
			.split("|")
			.filter((c) => c.trim())
			.map((c) => c.trim());

		// Check if this is a separator row
		if (cells.every((c) => /^[-:]+$/.test(c))) {
			return ""; // Remove separator rows
		}

		const isHeader = !html.includes("<tbody>");
		const cellTag = isHeader ? "th" : "td";
		const cellClass = isHeader
			? "px-4 py-2 text-left font-medium text-foreground bg-background-secondary"
			: "px-4 py-2 text-foreground-muted border-t border-border";

		return `<tr>${cells.map((c) => `<${cellTag} class="${cellClass}">${c}</${cellTag}>`).join("")}</tr>`;
	});

	// Wrap tables
	html = html.replace(
		/(<tr>[\s\S]*?<\/tr>)+/g,
		'<div class="overflow-x-auto my-4"><table class="w-full border border-border rounded-lg overflow-hidden">$&</table></div>'
	);

	// Lists
	html = html.replace(/^- (.*)$/gm, '<li class="ml-4 text-foreground-muted">$1</li>');
	html = html.replace(/^(\d+)\. (.*)$/gm, '<li class="ml-4 text-foreground-muted">$2</li>');

	// Wrap consecutive list items
	html = html.replace(
		/(<li[^>]*>.*<\/li>\n?)+/g,
		'<ul class="list-disc list-inside my-4 space-y-1">$&</ul>'
	);

	// Paragraphs (lines that aren't already wrapped)
	html = html
		.split("\n\n")
		.map((block) => {
			block = block.trim();
			if (
				!block ||
				block.startsWith("<") ||
				block.startsWith("#") ||
				block.startsWith("|")
			) {
				return block;
			}
			return `<p class="my-4 text-foreground-muted leading-relaxed">${block}</p>`;
		})
		.join("\n");

	// Line breaks within paragraphs
	html = html.replace(/\n(?![<])/g, "<br>");

	return html;
}

function escapeHtml(text: string): string {
	const map: Record<string, string> = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;",
	};
	return text.replace(/[&<>"']/g, (m) => map[m]);
}
