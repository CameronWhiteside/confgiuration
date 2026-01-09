import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Tag, Wrench, BookOpen, ArrowRight } from "lucide-react";
import {
	getArticleBySlug,
	getRelatedArticles,
	getAllArticles,
	type Article,
} from "@/lib/content";
import { getArticleFAQs, generateFAQJsonLd } from "@/lib/faq";
import { getTool } from "@/lib/tools";
import { FAQSection } from "@/components/ui/faq";
import { cn } from "@/lib/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://confgiuration.dev";

interface BlogPostPageProps {
	params: Promise<{ slug: string }>;
}

// Generate static params for all articles
export async function generateStaticParams() {
	const articles = getAllArticles();
	return articles.map((article) => ({
		slug: article.slug,
	}));
}

// Generate metadata for each article
export async function generateMetadata({
	params,
}: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const article = getArticleBySlug(slug);

	if (!article) {
		return {
			title: "Article Not Found",
			description: "The requested article was not found.",
		};
	}

	const tool = getTool(article.toolId);

	return {
		title: article.title,
		description: article.description,
		keywords: [
			...article.tags,
			tool?.name || "",
			"developer tools",
			"tutorial",
		].filter(Boolean),
		openGraph: {
			title: article.title,
			description: article.description,
			url: `${siteUrl}/blog/${article.slug}`,
			siteName: "confgiuration",
			type: "article",
			authors: ["confgiuration"],
		},
		twitter: {
			card: "summary_large_image",
			title: article.title,
			description: article.description,
		},
		alternates: {
			canonical: `${siteUrl}/blog/${article.slug}`,
		},
	};
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const article = getArticleBySlug(slug);

	if (!article) {
		notFound();
	}

	const tool = getTool(article.toolId);
	const relatedArticles = getRelatedArticles(slug);
	const articleFaqs = getArticleFAQs(slug);

	// Generate JSON-LD structured data
	const articleJsonLd = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: article.title,
		description: article.description,
		url: `${siteUrl}/blog/${article.slug}`,
		author: {
			"@type": "Organization",
			name: "confgiuration",
		},
		publisher: {
			"@type": "Organization",
			name: "confgiuration",
			url: siteUrl,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${siteUrl}/blog/${article.slug}`,
		},
		keywords: article.tags.join(", "),
	};

	// Generate FAQ JSON-LD if article has FAQs
	const faqJsonLd = articleFaqs.length > 0 ? generateFAQJsonLd(articleFaqs) : null;

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
			/>
			{faqJsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
				/>
			)}

			<article className="min-h-screen">
				{/* Header */}
				<header className="relative py-12 sm:py-16 overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-b from-accent-purple/5 via-background to-background" />
					<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						{/* Breadcrumbs */}
						<nav className="flex items-center gap-2 text-sm text-foreground-muted mb-6">
							<Link
								href="/blog"
								className="hover:text-foreground transition-colors flex items-center gap-1"
							>
								<ArrowLeft className="w-4 h-4" />
								Blog
							</Link>
							<span>/</span>
							{tool && (
								<>
									<Link
										href={tool.href}
										className="hover:text-foreground transition-colors flex items-center gap-1"
									>
										<Wrench className="w-3 h-3" />
										{tool.shortName}
									</Link>
									<span>/</span>
								</>
							)}
							<span className="text-foreground truncate">{article.title}</span>
						</nav>

						{/* Title */}
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
							{article.title}
						</h1>

						{/* Description */}
						<p className="text-lg text-foreground-muted mb-6">
							{article.description}
						</p>

						{/* Tags */}
						<div className="flex flex-wrap gap-2">
							{article.tags.map((tag) => (
								<span
									key={tag}
									className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-background-secondary text-foreground-muted"
								>
									<Tag className="w-3 h-3" />
									{tag}
								</span>
							))}
						</div>

						{/* Tool Link */}
						{tool && (
							<div className="mt-6 p-4 rounded-lg bg-background-secondary/50 border border-border">
								<Link
									href={tool.href}
									className="flex items-center gap-3 group"
								>
									<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple/10 to-accent-pink/10">
										<Wrench className="w-5 h-5 text-primary" />
									</div>
									<div className="flex-1">
										<p className="text-sm text-foreground-muted">
											Related tool
										</p>
										<p className="font-medium text-foreground group-hover:text-primary transition-colors">
											{tool.shortName} - {tool.description}
										</p>
									</div>
									<ArrowRight className="w-5 h-5 text-foreground-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
								</Link>
							</div>
						)}
					</div>
				</header>

				{/* Content */}
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
					<div className="prose prose-lg max-w-none">
						<MarkdownContent content={article.content} />
					</div>
				</div>

				{/* FAQ Section */}
				{articleFaqs.length > 0 && (
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						<FAQSection
							faqs={articleFaqs}
							title="Frequently Asked Questions"
							description="Common questions about this topic"
							includeSchema={false} // Already added as separate JSON-LD above
						/>
					</div>
				)}

				{/* Related Articles */}
				{relatedArticles.length > 0 && (
					<section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
						<div className="border-t border-border pt-12 mt-12">
							<div className="flex items-center gap-3 mb-6">
								<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple/10 to-accent-pink/10">
									<BookOpen className="w-5 h-5 text-primary" />
								</div>
								<div>
									<h2 className="text-xl font-bold text-foreground">
										Related Articles
									</h2>
									<p className="text-sm text-foreground-muted">
										Continue learning with these related guides
									</p>
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								{relatedArticles.map((related) => (
									<RelatedArticleCard key={related.slug} article={related} />
								))}
							</div>
						</div>
					</section>
				)}
			</article>
		</>
	);
}

function RelatedArticleCard({ article }: { article: Article }) {
	const tool = getTool(article.toolId);

	return (
		<Link
			href={`/blog/${article.slug}`}
			className={cn(
				"group block p-5 rounded-xl border border-border bg-card",
				"transition-all duration-200 hover:shadow-lg hover:border-border-hover hover:-translate-y-0.5"
			)}
		>
			<div className="flex items-center gap-2 text-xs text-foreground-muted mb-2">
				{tool && (
					<>
						<Wrench className="w-3 h-3" />
						<span>{tool.shortName}</span>
					</>
				)}
			</div>
			<h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
				{article.title}
			</h3>
			<p className="text-sm text-foreground-muted line-clamp-2">
				{article.description}
			</p>
		</Link>
	);
}

// Markdown renderer component
function MarkdownContent({ content }: { content: string }) {
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
		return `<pre class="language-${language} bg-background-secondary rounded-lg p-4 overflow-x-auto my-6"><code class="text-sm font-mono">${escapedCode}</code></pre>`;
	});

	// Inline code
	html = html.replace(
		/`([^`]+)`/g,
		'<code class="bg-background-secondary px-1.5 py-0.5 rounded text-sm font-mono text-foreground">$1</code>'
	);

	// Headers
	html = html.replace(
		/^### (.*$)/gm,
		'<h3 class="text-xl font-semibold mt-8 mb-4 text-foreground">$1</h3>'
	);
	html = html.replace(
		/^## (.*$)/gm,
		'<h2 class="text-2xl font-bold mt-10 mb-5 text-foreground">$1</h2>'
	);

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
		'<div class="overflow-x-auto my-6"><table class="w-full border border-border rounded-lg overflow-hidden text-sm">$&</table></div>'
	);

	// Lists
	html = html.replace(
		/^- (.*)$/gm,
		'<li class="ml-4 text-foreground-muted">$1</li>'
	);
	html = html.replace(
		/^(\d+)\. (.*)$/gm,
		'<li class="ml-4 text-foreground-muted">$2</li>'
	);

	// Wrap consecutive list items
	html = html.replace(
		/(<li[^>]*>.*<\/li>\n?)+/g,
		'<ul class="list-disc list-inside my-4 space-y-2">$&</ul>'
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
			return `<p class="my-5 text-foreground-muted leading-relaxed">${block}</p>`;
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
