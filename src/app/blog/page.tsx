import Link from "next/link";
import { BookOpen, Tag, ArrowRight, Wrench } from "lucide-react";
import { getAllArticles, type Article } from "@/lib/content";
import { getTool } from "@/lib/tools";
import { cn } from "@/lib/utils";

export default function BlogPage() {
	const articles = getAllArticles();

	// Group articles by tool
	const articlesByTool = articles.reduce(
		(acc, article) => {
			if (!acc[article.toolId]) {
				acc[article.toolId] = [];
			}
			acc[article.toolId].push(article);
			return acc;
		},
		{} as Record<string, Article[]>
	);

	// Sort tools by number of articles
	const toolIds = Object.keys(articlesByTool).sort(
		(a, b) => articlesByTool[b].length - articlesByTool[a].length
	);

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative py-16 sm:py-24 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-accent-purple/5 via-background to-background" />
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center max-w-3xl mx-auto">
						<div className="flex items-center justify-center gap-2 mb-4">
							<BookOpen className="w-8 h-8 text-primary" />
						</div>
						<h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
							Developer Tools{" "}
							<span className="bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
								Blog
							</span>
						</h1>
						<p className="text-lg text-foreground-muted max-w-2xl mx-auto">
							Learn about encoding, hashing, security best practices, and more.
							In-depth guides to help you understand the tools you use every
							day.
						</p>
						<p className="mt-4 text-sm text-foreground-muted">
							{articles.length} articles across {toolIds.length} tools
						</p>
					</div>
				</div>
			</section>

			{/* Articles by Tool */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
				<div className="space-y-16">
					{toolIds.map((toolId) => {
						const tool = getTool(toolId);
						const toolArticles = articlesByTool[toolId];

						if (!tool) return null;

						return (
							<div key={toolId}>
								{/* Tool Header */}
								<div className="flex items-center gap-3 mb-6">
									<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple/10 to-accent-pink/10">
										<Wrench className="w-5 h-5 text-primary" />
									</div>
									<div className="flex-1">
										<Link
											href={tool.href}
											className="group flex items-center gap-2"
										>
											<h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
												{tool.name}
											</h2>
											<ArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
										</Link>
										<p className="text-sm text-foreground-muted">
											{toolArticles.length} article
											{toolArticles.length !== 1 ? "s" : ""}
										</p>
									</div>
								</div>

								{/* Articles Grid */}
								<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{toolArticles.map((article) => (
										<ArticleCard key={article.slug} article={article} />
									))}
								</div>
							</div>
						);
					})}
				</div>
			</section>
		</div>
	);
}

function ArticleCard({ article }: { article: Article }) {
	return (
		<article
			className={cn(
				"group rounded-xl border border-border bg-card overflow-hidden",
				"transition-all duration-200 hover:shadow-lg hover:border-border-hover hover:-translate-y-0.5"
			)}
		>
			<Link href={`/blog/${article.slug}`} className="block p-5">
				<h3 className="font-semibold text-foreground text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
					{article.title}
				</h3>
				<p className="text-sm text-foreground-muted line-clamp-2 mb-4">
					{article.description}
				</p>
				<div className="flex flex-wrap gap-2 mb-4">
					{article.tags.slice(0, 3).map((tag) => (
						<span
							key={tag}
							className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-background-secondary text-foreground-muted"
						>
							<Tag className="w-3 h-3" />
							{tag}
						</span>
					))}
				</div>
				<div className="flex items-center text-sm text-primary font-medium">
					Read article
					<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
				</div>
			</Link>
		</article>
	);
}
