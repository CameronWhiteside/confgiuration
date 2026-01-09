"use client";

import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { heroTextContainer, heroTextWord } from "@/lib/animations";
import { tools } from "@/lib/tools";

interface HeroProps {
	onOpenSearch: () => void;
}

export function Hero({ onOpenSearch }: HeroProps) {
	const headlineWords = ["Developer", "Tools"];

	return (
		<div className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
			{/* Badge */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex justify-center mb-8"
			>
				<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 border border-primary/20">
					<Sparkles className="w-4 h-4 text-primary" />
					<span className="text-sm font-medium text-primary">
						{tools.length} tools available
					</span>
				</div>
			</motion.div>

			{/* Headline */}
			<motion.h1
				variants={heroTextContainer}
				initial="initial"
				animate="animate"
				className="text-center mb-6"
			>
				<span className="sr-only">Developer Tools</span>
				<span className="flex flex-wrap justify-center gap-x-4 gap-y-2" aria-hidden>
					{headlineWords.map((word, index) => (
						<motion.span
							key={index}
							variants={heroTextWord}
							className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
							style={{
								// Alternate gradient for "Tools" word
								...(word === "Tools"
									? {
											background: "linear-gradient(135deg, #a855f7, #ec4899)",
											WebkitBackgroundClip: "text",
											WebkitTextFillColor: "transparent",
											backgroundClip: "text",
										}
									: {}),
							}}
						>
							{word}
						</motion.span>
					))}
				</span>
			</motion.h1>

			{/* Subtitle */}
			<motion.p
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6, duration: 0.5 }}
				className="text-center text-lg sm:text-xl text-foreground-muted max-w-2xl mx-auto mb-10 px-4"
			>
				Encoding, formatting, generating, and transforming data.
			</motion.p>

			{/* Search Button */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.8, duration: 0.5 }}
				className="flex justify-center"
			>
				<motion.button
					whileHover={{ scale: 1.02, y: -2 }}
					whileTap={{ scale: 0.98 }}
					onClick={onOpenSearch}
					className="group flex items-center gap-4 px-6 py-4 rounded-xl bg-card border border-border hover:border-border-hover shadow-lg hover:shadow-xl transition-all duration-300"
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
				</motion.button>
			</motion.div>
		</div>
	);
}
