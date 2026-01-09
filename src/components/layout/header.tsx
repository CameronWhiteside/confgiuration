"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { tools } from "@/lib/tools";

interface HeaderProps {
	onOpenSearch: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
	const pathname = usePathname();

	return (
		<header
			className="sticky top-0 z-50 w-full border-b border-border glass"
			role="banner"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-3 group"
						aria-label="confgiuration - Home"
					>
						<div className="relative">
							{/* Logo mark */}
							<div
								className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center"
								aria-hidden="true"
							>
								<span className="text-white font-mono font-bold text-sm">
									cf
								</span>
							</div>
						</div>
						<span className="font-mono text-lg font-bold tracking-tight text-foreground">
							confg<span className="text-primary">i</span>uration
						</span>
					</Link>

					{/* Navigation - Desktop */}
					<nav
						className="hidden lg:flex items-center gap-1"
						aria-label="Main navigation"
					>
						{tools.slice(0, 7).map((tool) => (
							<Link
								key={tool.id}
								href={tool.href}
								aria-current={pathname === tool.href ? "page" : undefined}
								className={cn(
									"px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
									pathname === tool.href
										? "text-foreground bg-background-secondary"
										: "text-foreground-muted hover:text-foreground hover:bg-background-secondary/50"
								)}
							>
								{tool.name}
							</Link>
						))}
						{tools.length > 7 && (
							<span className="px-2 text-foreground-muted text-sm" aria-hidden="true">
								+{tools.length - 7} more
							</span>
						)}
						<Link
							href="/blog"
							aria-current={pathname.startsWith("/blog") ? "page" : undefined}
							className={cn(
								"px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
								pathname.startsWith("/blog")
									? "text-foreground bg-background-secondary"
									: "text-foreground-muted hover:text-foreground hover:bg-background-secondary/50"
							)}
						>
							Blog
						</Link>
					</nav>

					{/* Search Trigger */}
					<button
						onClick={onOpenSearch}
						aria-label="Search tools (Press Command K)"
						aria-keyshortcuts="Meta+K"
						className={cn(
							"flex items-center gap-3 px-3 py-2 rounded-lg",
							"bg-background-secondary/50 hover:bg-background-secondary",
							"border border-border hover:border-border-hover",
							"text-foreground-muted transition-all duration-150"
						)}
					>
						<Search className="w-4 h-4" aria-hidden="true" />
						<span className="hidden sm:inline text-sm">Search tools...</span>
						<kbd
							className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-card rounded border border-border"
							aria-hidden="true"
						>
							<Command className="w-3 h-3" />K
						</kbd>
					</button>
				</div>
			</div>
		</header>
	);
}
