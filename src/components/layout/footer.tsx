"use client";

import Link from "next/link";
import { tools, categories, type Category } from "@/lib/tools";

export function Footer() {
	// Group tools by category
	const toolsByCategory = tools.reduce(
		(acc, tool) => {
			if (!acc[tool.category]) {
				acc[tool.category] = [];
			}
			acc[tool.category].push(tool);
			return acc;
		},
		{} as Record<Category, typeof tools>
	);

	const currentYear = new Date().getFullYear();

	return (
		<footer
			role="contentinfo"
			className="border-t border-border bg-background-secondary/30 mt-auto"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Main footer content */}
				<div className="py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
					{/* Brand column */}
					<div className="col-span-2 md:col-span-3 lg:col-span-1">
						<Link href="/" className="inline-flex items-center gap-2 mb-4">
							<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
								<span className="text-white font-mono font-bold text-sm">
									cf
								</span>
							</div>
							<span className="font-mono text-lg font-bold tracking-tight text-foreground">
								confg<span className="text-primary">i</span>uration
							</span>
						</Link>
						<p className="text-sm text-foreground-muted mb-4">
							Free online developer tools for encoding, formatting, and
							transforming data.
						</p>
						<p className="text-xs text-foreground-muted">
							No sign-up required. All processing happens in your browser.
						</p>
					</div>

					{/* Tool categories */}
					{(Object.entries(categories) as [Category, (typeof categories)[Category]][]).map(
						([categoryKey, categoryInfo]) => (
							<nav
								key={categoryKey}
								aria-label={`${categoryInfo.label} tools`}
							>
								<h2 className="font-semibold text-foreground mb-3 text-sm">
									{categoryInfo.label}
								</h2>
								<ul className="space-y-2">
									{toolsByCategory[categoryKey]?.map((tool) => (
										<li key={tool.id}>
											<Link
												href={tool.href}
												className="text-sm text-foreground-muted hover:text-foreground transition-colors"
											>
												{tool.name}
											</Link>
										</li>
									))}
								</ul>
							</nav>
						)
					)}
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-sm text-foreground-muted">
						&copy; {currentYear} confgiuration. All rights reserved.
					</p>
					<nav aria-label="Legal links">
						<ul className="flex items-center gap-6 text-sm text-foreground-muted">
							<li>
								<Link
									href="/privacy"
									className="hover:text-foreground transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="hover:text-foreground transition-colors"
								>
									Terms of Service
								</Link>
							</li>
							<li>
								<a
									href="https://github.com/confgiuration"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-foreground transition-colors"
								>
									GitHub
								</a>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</footer>
	);
}
