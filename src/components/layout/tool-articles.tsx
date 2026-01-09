"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Tag, ArrowRight } from "lucide-react";
import { type Article } from "@/lib/content";
import { cn } from "@/lib/utils";

interface ToolArticlesProps {
	articles: Article[];
	toolName: string;
}

export function ToolArticles({ articles, toolName }: ToolArticlesProps) {
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

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{articles.map((article) => (
					<ArticleCard key={article.slug} article={article} />
				))}
			</div>
		</section>
	);
}

interface ArticleCardProps {
	article: Article;
}

function ArticleCard({ article }: ArticleCardProps) {
	return (
		<motion.article
			whileHover={{ y: -2 }}
			className={cn(
				"group rounded-xl border border-border bg-card overflow-hidden",
				"transition-shadow duration-200 hover:shadow-lg hover:border-border-hover"
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
		</motion.article>
	);
}


