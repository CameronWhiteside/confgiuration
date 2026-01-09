"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTool, tools, categories, type Category } from "@/lib/tools";
import { getToolContent } from "@/lib/content";
import { getToolIcon } from "@/components/icons/tool-icons";
import { ToolArticles } from "@/components/layout/tool-articles";
import { pageVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface ToolLayoutProps {
	toolId: string;
	children: ReactNode;
}

// Category-specific gradient configurations
const categoryGradients: Record<
	Category,
	{ bg: string; orb1: string; orb2: string; icon: string }
> = {
	encoding: {
		bg: "from-violet-500/5 via-transparent to-purple-500/5",
		orb1: "from-violet-500/20 to-transparent",
		orb2: "from-purple-500/15 to-transparent",
		icon: "from-violet-500/20 to-purple-500/20",
	},
	data: {
		bg: "from-blue-500/5 via-transparent to-cyan-500/5",
		orb1: "from-blue-500/20 to-transparent",
		orb2: "from-cyan-500/15 to-transparent",
		icon: "from-blue-500/20 to-cyan-500/20",
	},
	generators: {
		bg: "from-pink-500/5 via-transparent to-rose-500/5",
		orb1: "from-pink-500/20 to-transparent",
		orb2: "from-rose-500/15 to-transparent",
		icon: "from-pink-500/20 to-rose-500/20",
	},
	text: {
		bg: "from-amber-500/5 via-transparent to-orange-500/5",
		orb1: "from-amber-500/20 to-transparent",
		orb2: "from-orange-500/15 to-transparent",
		icon: "from-amber-500/20 to-orange-500/20",
	},
	utilities: {
		bg: "from-emerald-500/5 via-transparent to-teal-500/5",
		orb1: "from-emerald-500/20 to-transparent",
		orb2: "from-teal-500/15 to-transparent",
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
	const toolContent = getToolContent(toolId);

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
			{/* Category-specific background gradient - outside animated container */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
				{/* Base gradient */}
				<div
					className={cn(
						"absolute inset-0 bg-gradient-to-br",
						gradient.bg
					)}
				/>

				{/* Floating orbs */}
				<motion.div
					initial={{ opacity: 1 }}
					animate={{
						y: [0, -20, 0],
						x: [0, 10, 0],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className={cn(
						"absolute -top-20 right-0 w-[600px] h-[600px] rounded-full blur-3xl bg-gradient-to-br",
						gradient.orb1
					)}
				/>
				<motion.div
					initial={{ opacity: 1 }}
					animate={{
						y: [0, 20, 0],
						x: [0, -10, 0],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className={cn(
						"absolute -bottom-20 left-0 w-[600px] h-[600px] rounded-full blur-3xl bg-gradient-to-tr",
						gradient.orb2
					)}
				/>
			</div>

			<motion.div
				variants={pageVariants}
				initial="initial"
				animate="animate"
				exit="exit"
				className="min-h-[calc(100vh-4rem)] relative"
			>
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
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.1, duration: 0.3 }}
						className={cn(
							"flex items-center justify-center w-14 h-14 rounded-xl",
							"bg-gradient-to-br",
							gradient.icon
						)}
						aria-hidden="true"
					>
						<Icon className="w-7 h-7" />
					</motion.div>
					<div>
						<div className="flex items-center gap-3 mb-1">
							<motion.h1
								initial={{ x: -10, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ delay: 0.15, duration: 0.3 }}
								className="font-mono text-2xl sm:text-3xl font-bold text-foreground"
							>
								{tool.name}
							</motion.h1>
							<motion.span
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2, duration: 0.3 }}
								className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-background-secondary text-foreground-muted"
							>
								{categoryInfo.label}
							</motion.span>
						</div>
						<motion.p
							initial={{ x: -10, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ delay: 0.2, duration: 0.3 }}
							className="text-foreground-muted"
						>
							{tool.description}
						</motion.p>
					</div>
				</div>
			</header>

			{/* Tool Content */}
			<section aria-label={`${tool.name} tool`}>
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.25, duration: 0.4 }}
				>
					{children}
				</motion.div>
			</section>

			{/* Articles Section */}
			{toolContent && toolContent.articles.length > 0 && (
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.35, duration: 0.4 }}
				>
					<ToolArticles articles={toolContent.articles} toolName={tool.name} />
				</motion.div>
			)}

			{/* Related Tools Section */}
			<aside aria-label="Related tools">
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.4 }}
					className="mt-16 pt-8 border-t border-border"
				>
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
				</motion.div>
			</aside>
		</motion.div>
		</>
	);
}
