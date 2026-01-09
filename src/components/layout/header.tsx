"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, Command, ChevronDown, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { tools, categories, type Category } from "@/lib/tools";

interface HeaderProps {
	onOpenSearch: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
	const pathname = usePathname();
	const [openDropdown, setOpenDropdown] = useState<Category | null>(null);

	const categoryOrder: Category[] = ["encoding", "data", "generators", "text", "utilities"];

	return (
		<header
			className="sticky top-0 z-50 w-full border-b border-border glass"
			role="banner"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 gap-4">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-3 group flex-shrink-0"
						aria-label="confgiuration - Home"
					>
						<div className="relative">
							<div
								className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center"
								aria-hidden="true"
							>
								<span className="text-white font-mono font-bold text-sm">
									cf
								</span>
							</div>
						</div>
						<span className="font-mono text-lg font-bold tracking-tight text-foreground hidden sm:block">
							confg<span className="text-primary">i</span>uration
						</span>
					</Link>

					{/* Center: Search Bar (prominent) */}
					<button
						onClick={onOpenSearch}
						aria-label="Search tools (Press Command K)"
						aria-keyshortcuts="Meta+K"
						className={cn(
							"flex-1 max-w-md flex items-center gap-3 px-4 py-2.5 rounded-xl",
							"bg-background-secondary/70 hover:bg-background-secondary",
							"border border-border hover:border-primary/50",
							"text-foreground-muted transition-all duration-150",
							"shadow-sm hover:shadow-md"
						)}
					>
						<Search className="w-4 h-4" aria-hidden="true" />
						<span className="text-sm flex-1 text-left">Search all tools...</span>
						<kbd
							className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-card rounded border border-border"
							aria-hidden="true"
						>
							<Command className="w-3 h-3" />K
						</kbd>
					</button>

					{/* Right: Navigation */}
					<nav
						className="hidden lg:flex items-center gap-1"
						aria-label="Main navigation"
					>
						{/* Category Dropdowns */}
						{categoryOrder.map((categoryKey) => {
							const category = categories[categoryKey];
							const categoryTools = tools.filter(t => t.category === categoryKey);
							const isOpen = openDropdown === categoryKey;
							const hasActiveTool = categoryTools.some(t => pathname === t.href);

							return (
								<div
									key={categoryKey}
									className="relative"
									onMouseEnter={() => setOpenDropdown(categoryKey)}
									onMouseLeave={() => setOpenDropdown(null)}
								>
									<button
										className={cn(
											"px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1",
											hasActiveTool
												? "text-foreground bg-background-secondary"
												: "text-foreground-muted hover:text-foreground hover:bg-background-secondary/50"
										)}
									>
										{category.label}
										<ChevronDown className={cn(
											"w-3 h-3 transition-transform",
											isOpen && "rotate-180"
										)} />
									</button>

									{/* Dropdown */}
									{isOpen && (
										<div className="absolute top-full left-0 pt-1 z-50">
											<div className="bg-card border border-border rounded-xl shadow-lg py-2 min-w-[240px]">
												{categoryTools.map((tool) => (
													<Link
														key={tool.id}
														href={tool.href}
														className={cn(
															"block px-4 py-2.5 transition-colors",
															pathname === tool.href
																? "bg-primary/10 text-primary"
																: "hover:bg-background-secondary text-foreground"
														)}
													>
														<div className="font-medium text-sm">{tool.shortName}</div>
														<div className="text-xs text-foreground-muted mt-0.5">
															{tool.description}
														</div>
													</Link>
												))}
											</div>
										</div>
									)}
								</div>
							);
						})}

						{/* Blog Link */}
						<Link
							href="/blog"
							aria-current={pathname.startsWith("/blog") ? "page" : undefined}
							className={cn(
								"px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5",
								pathname.startsWith("/blog")
									? "text-foreground bg-background-secondary"
									: "text-foreground-muted hover:text-foreground hover:bg-background-secondary/50"
							)}
						>
							<BookOpen className="w-3.5 h-3.5" />
							Blog
						</Link>
					</nav>

					{/* Mobile: Search only (nav in command palette) */}
					<button
						onClick={onOpenSearch}
						aria-label="Search tools"
						className="lg:hidden p-2 rounded-lg hover:bg-background-secondary text-foreground-muted"
					>
						<Search className="w-5 h-5" />
					</button>
				</div>
			</div>
		</header>
	);
}
