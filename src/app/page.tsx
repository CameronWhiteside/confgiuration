import { Metadata } from "next";
import { tools, categories, type Category, type Tool } from "@/lib/tools";
import { getToolIcon } from "@/components/icons/tool-icons";
import { HomeClient } from "@/components/home/home-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
	title: "confgiuration - Free Online Developer Tools",
	description:
		"Free online developer tools for encoding, formatting, generating, and transforming data. Base64, JSON, UUID, Hash, JWT, QR codes, and more. No sign-up required.",
	alternates: {
		canonical: "/",
	},
};

// Server-rendered tool card for SEO
function ToolCard({ tool }: { tool: Tool }) {
	const Icon = getToolIcon(tool.id);
	const categoryInfo = categories[tool.category];

	return (
		<Link href={tool.href} className="block group">
			<article
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
						<h2 className="font-mono text-lg font-semibold text-foreground">
							{tool.shortName}
						</h2>
						<ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
					</div>

					{/* Description */}
					<p className="text-sm text-foreground-muted mb-4 line-clamp-2">
						{tool.description}
					</p>

					{/* Category Badge */}
					<span
						className={cn(
							"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
							"bg-background-secondary text-foreground-muted"
						)}
					>
						{categoryInfo.label}
					</span>
				</div>
			</article>
		</Link>
	);
}

// Server-rendered category section
function CategorySection({ category, categoryTools }: { category: Category; categoryTools: Tool[] }) {
	const categoryInfo = categories[category];
	
	return (
		<section className="mb-12" aria-labelledby={`category-${category}`}>
			<h2 
				id={`category-${category}`}
				className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"
			>
				<span className={cn(
					"w-3 h-3 rounded-full bg-gradient-to-r",
					categoryInfo.color
				)} />
				{categoryInfo.label}
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{categoryTools.map((tool) => (
					<ToolCard key={tool.id} tool={tool} />
				))}
			</div>
		</section>
	);
}

export default function Home() {
	// Group tools by category for better SEO structure
	const toolsByCategory = tools.reduce((acc, tool) => {
		if (!acc[tool.category]) {
			acc[tool.category] = [];
		}
		acc[tool.category].push(tool);
		return acc;
	}, {} as Record<Category, Tool[]>);

	const categoryOrder: Category[] = ["encoding", "data", "generators", "text", "utilities"];

	return (
		<div className="relative">
			{/* Static background gradient */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
				<div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-accent-pink/5" />
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl" />
			</div>

			{/* Hero Section - Server rendered */}
			<header className="relative z-10 py-16 sm:py-24">
				<div className="text-center">
					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
						Developer Tools,{" "}
						<span className="bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
							Simplified
						</span>
					</h1>
					<p className="text-lg sm:text-xl text-foreground-muted max-w-2xl mx-auto mb-8 px-4">
						Free online tools for encoding, formatting, and transforming data.
						No sign-up required. All processing happens in your browser.
					</p>
					
					{/* Client component for interactive search */}
					<HomeClient />
				</div>
			</header>

			{/* Tools Grid - Server rendered for SEO */}
			<main className="relative z-10 pb-16">
				{categoryOrder.map((category) => (
					<CategorySection
						key={category}
						category={category}
						categoryTools={toolsByCategory[category] || []}
					/>
				))}
			</main>

			{/* JSON-LD for tools collection */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "ItemList",
						name: "Developer Tools",
						description: "Collection of free online developer tools",
						numberOfItems: tools.length,
						itemListElement: tools.map((tool, index) => ({
							"@type": "ListItem",
							position: index + 1,
							item: {
								"@type": "WebApplication",
								name: tool.name,
								description: tool.description,
								url: `https://confgiuration.dev${tool.href}`,
								applicationCategory: "DeveloperApplication",
								offers: {
									"@type": "Offer",
									price: "0",
									priceCurrency: "USD",
								},
							},
						})),
					}),
				}}
			/>
		</div>
	);
}
