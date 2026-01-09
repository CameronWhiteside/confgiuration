"use client";

import { Search, Sparkles } from "lucide-react";
import { tools } from "@/lib/tools";

interface HeroProps {
	onOpenSearch: () => void;
}

export function Hero({ onOpenSearch }: HeroProps) {
	return (
		<div className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
			{/* Badge */}
			<div className="flex justify-center mb-8">
				<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 border border-primary/20">
					<Sparkles className="w-4 h-4 text-primary" />
					<span className="text-sm font-medium text-primary">
						{tools.length} tools available
					</span>
				</div>
			</div>

			{/* Headline */}
			<h1 className="text-center mb-6">
				<span className="sr-only">Developer Tools</span>
				<span className="flex flex-wrap justify-center gap-x-4 gap-y-2" aria-hidden>
					<span className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
						Developer
					</span>
					<span 
						className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
						style={{
							background: "linear-gradient(135deg, #a855f7, #ec4899)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
						}}
					>
						Tools
					</span>
				</span>
			</h1>

			{/* Subtitle */}
			<p className="text-center text-lg sm:text-xl text-foreground-muted max-w-2xl mx-auto mb-10 px-4">
				Encoding, formatting, generating, and transforming data.
			</p>

			{/* Search Button */}
			<div className="flex justify-center">
				<button
					onClick={onOpenSearch}
					className="group flex items-center gap-4 px-6 py-4 rounded-xl bg-card border border-border hover:border-border-hover shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
				>
					<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple/10 to-accent-pink/10 text-primary group-hover:from-accent-purple/20 group-hover:to-accent-pink/20 transition-colors">
						<Search className="w-5 h-5" />
					</div>
					<div className="text-left">
						<div className="text-foreground font-medium">Search all tools</div>
						<div className="text-sm text-foreground-muted">
							Press{" "}
							<kbd className="px-1.5 py-0.5 text-xs font-mono bg-background-secondary rounded border border-border">
								⌘K
							</kbd>{" "}
							to open
						</div>
					</div>
				</button>
			</div>
		</div>
	);
}
