"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTool, tools, categories, type Category } from "@/lib/tools";
import { getArticlesForTool } from "@/lib/content";
import { getToolFAQs } from "@/lib/faq";
import { getToolIcon } from "@/components/icons/tool-icons";
import { ToolArticles } from "@/components/layout/tool-articles";
import { FAQSection } from "@/components/ui/faq";
import { cn } from "@/lib/utils";

interface ToolLayoutProps {
	toolId: string;
	children: ReactNode;
}

// Category-specific gradient configurations
const categoryGradients: Record<
	Category,
	{ bg: string; icon: string }
> = {
	encoding: {
		bg: "from-violet-500/5 via-transparent to-purple-500/5",
		icon: "from-violet-500/20 to-purple-500/20",
	},
	data: {
		bg: "from-blue-500/5 via-transparent to-cyan-500/5",
		icon: "from-blue-500/20 to-cyan-500/20",
	},
	generators: {
		bg: "from-pink-500/5 via-transparent to-rose-500/5",
		icon: "from-pink-500/20 to-rose-500/20",
	},
	text: {
		bg: "from-amber-500/5 via-transparent to-orange-500/5",
		icon: "from-amber-500/20 to-orange-500/20",
	},
	utilities: {
		bg: "from-emerald-500/5 via-transparent to-teal-500/5",
		icon: "from-emerald-500/20 to-teal-500/20",
	},
};

export function ToolLayout({ toolId, children }: ToolLayoutProps) {
	const tool = getTool(toolId);
	const Icon = getToolIcon(toolId);

	if (!tool) {
		return <div>Tool not found</div>;
	}

	const gradient = categoryGradients[tool.category];
	const categoryInfo = categories[tool.category];
	const toolArticles = getArticlesForTool(toolId);
	const toolFaqs = getToolFAQs(toolId);

	// Get related tools (same category, excluding current)
	const relatedTools = tools
		.filter((t) => t.category === tool.category && t.id !== toolId)
		.slice(0, 4);

	// Get a few tools from other categories for variety
	const otherTools = tools
		.filter((t) => t.category !== tool.category)
		.slice(0, 4);

	return (
		<>
			{/* Category-specific background gradient */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
				<div
					className={cn(
						"absolute inset-0 bg-gradient-to-br",
						gradient.bg
					)}
				/>
			</div>

			<div className="min-h-[calc(100vh-4rem)] relative">
				{/* Tool Header */}
				<header className="mb-8">
					{/* Breadcrumb Navigation */}
					<nav aria-label="Breadcrumb" className="mb-4">
						<ol className="flex items-center gap-2 text-sm">
							<li>
								<Link
									href="/"
									className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors"
								>
									<ArrowLeft className="w-4 h-4" aria-hidden="true" />
									<span>All Tools</span>
								</Link>
							</li>
							<li aria-hidden="true" className="text-foreground-muted">/</li>
							<li>
								<span className="text-foreground-muted">{categoryInfo.label}</span>
							</li>
							<li aria-hidden="true" className="text-foreground-muted">/</li>
							<li aria-current="page">
								<span className="text-foreground font-medium">{tool.name}</span>
							</li>
						</ol>
					</nav>

					{/* Title Row */}
					<div className="flex items-start gap-4">
						<div
							className={cn(
								"flex items-center justify-center w-14 h-14 rounded-xl",
								"bg-gradient-to-br",
								gradient.icon
							)}
							aria-hidden="true"
						>
							<Icon className="w-7 h-7" />
						</div>
						<div>
							<div className="flex items-center gap-3 mb-1">
								<h1 className="font-mono text-2xl sm:text-3xl font-bold text-foreground">
									{tool.name}
								</h1>
								<span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-background-secondary text-foreground-muted">
									{categoryInfo.label}
								</span>
							</div>
							<p className="text-foreground-muted">
								{tool.description}
							</p>
						</div>
					</div>
				</header>

				{/* Tool Content */}
				<section aria-label={`${tool.name} tool`}>
					{children}
				</section>

				{/* Articles Section */}
				{toolArticles.length > 0 && (
					<ToolArticles articles={toolArticles} toolName={tool.name} />
				)}

				{/* FAQ Section */}
				{toolFaqs.length > 0 && (
					<FAQSection
						faqs={toolFaqs}
						title={`${tool.name} FAQ`}
						description={`Common questions about using the ${tool.name} tool`}
					/>
				)}

				{/* Related Tools Section */}
				<aside aria-label="Related tools">
					<div className="mt-16 pt-8 border-t border-border">
						{relatedTools.length > 0 && (
							<nav aria-label={`More ${categoryInfo.label} tools`} className="mb-10">
								<h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wider mb-4">
									More {categoryInfo.label} Tools
								</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
									{relatedTools.map((relatedTool) => {
										const RelatedIcon = getToolIcon(relatedTool.id);
										const relatedGradient = categoryGradients[relatedTool.category];
										return (
											<Link
												key={relatedTool.id}
												href={relatedTool.href}
												className="group"
											>
												<div
													className={cn(
														"flex items-center gap-3 p-3 rounded-lg",
														"bg-card border border-border",
														"hover:border-border-hover hover:shadow-md",
														"transition-all duration-200"
													)}
												>
													<div
														className={cn(
															"flex items-center justify-center w-10 h-10 rounded-lg",
															"bg-gradient-to-br",
															relatedGradient.icon
														)}
													>
														<RelatedIcon className="w-5 h-5" />
													</div>
													<div className="flex-1 min-w-0">
														<div className="font-medium text-sm text-foreground truncate">
															{relatedTool.name}
														</div>
														<div className="text-xs text-foreground-muted truncate">
															{relatedTool.description}
														</div>
													</div>
													<ArrowRight className="w-4 h-4 text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity" />
												</div>
											</Link>
										);
									})}
								</div>
							</nav>
						)}

						<nav aria-label="Explore other tools">
							<h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wider mb-4">
								Explore Other Tools
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
								{otherTools.map((otherTool) => {
									const OtherIcon = getToolIcon(otherTool.id);
									const otherGradient = categoryGradients[otherTool.category];
									return (
										<Link
											key={otherTool.id}
											href={otherTool.href}
											className="group"
										>
											<div
												className={cn(
													"flex items-center gap-3 p-3 rounded-lg",
													"bg-card border border-border",
													"hover:border-border-hover hover:shadow-md",
													"transition-all duration-200"
												)}
											>
												<div
													className={cn(
														"flex items-center justify-center w-10 h-10 rounded-lg",
														"bg-gradient-to-br",
														otherGradient.icon
													)}
													aria-hidden="true"
												>
													<OtherIcon className="w-5 h-5" />
												</div>
												<div className="flex-1 min-w-0">
													<div className="font-medium text-sm text-foreground truncate">
														{otherTool.name}
													</div>
													<div className="text-xs text-foreground-muted truncate">
														{otherTool.description}
													</div>
												</div>
												<ArrowRight className="w-4 h-4 text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
											</div>
										</Link>
									);
								})}
							</div>
						</nav>
					</div>
				</aside>
			</div>
		</>
	);
}
