"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tools, categories, type Category, type Tool } from "@/lib/tools";
import { getToolIcon } from "@/components/icons/tool-icons";
import { cn } from "@/lib/utils";

interface ToolGridProps {
	selectedCategory: Category | "all";
}

export function ToolGrid({ selectedCategory }: ToolGridProps) {
	const filteredTools =
		selectedCategory === "all"
			? tools
			: tools.filter((tool) => tool.category === selectedCategory);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{filteredTools.map((tool) => (
				<ToolCard key={tool.id} tool={tool} />
			))}
		</div>
	);
}

function ToolCard({ tool }: { tool: Tool }) {
	const Icon = getToolIcon(tool.id);
	const categoryInfo = categories[tool.category];

	return (
		<Link href={tool.href} className="block group">
			<div
				className={cn(
					"relative p-6 rounded-xl bg-card border border-border",
					"transition-all duration-200",
					"hover:shadow-lg hover:border-border-hover hover:-translate-y-1",
					"overflow-hidden"
				)}
			>
				{/* Gradient border on hover */}
				<div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
					<div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-br from-accent-purple/50 to-accent-pink/50">
						<div className="w-full h-full rounded-xl bg-card" />
					</div>
				</div>

				{/* Content */}
				<div className="relative z-10">
					{/* Icon */}
					<div
						className={cn(
							"inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4",
							"bg-gradient-to-br from-accent-purple/10 to-accent-pink/10",
							"text-primary transition-transform duration-200",
							"group-hover:scale-110"
						)}
					>
						<Icon className="w-6 h-6" />
					</div>

					{/* Title + Arrow */}
					<div className="flex items-center justify-between mb-2">
						<h3 className="font-mono text-lg font-semibold text-foreground">
							{tool.name}
						</h3>
						<ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
					</div>

					{/* Description */}
					<p className="text-sm text-foreground-muted mb-4 line-clamp-2">
						{tool.description}
					</p>

					{/* Category Badge */}
					<div
						className={cn(
							"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
							"bg-background-secondary text-foreground-muted"
						)}
					>
						{categoryInfo.label}
					</div>
				</div>
			</div>
		</Link>
	);
}
