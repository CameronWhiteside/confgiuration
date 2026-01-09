"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { tools, categories, type Category } from "@/lib/tools";
import { getToolIcon } from "@/components/icons/tool-icons";
import { cn } from "@/lib/utils";
import { backdropVariants, commandPaletteVariants } from "@/lib/animations";

interface CommandPaletteProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	// Focus input when opened
	useEffect(() => {
		if (open) {
			// Small delay to ensure the modal is rendered
			setTimeout(() => {
				inputRef.current?.focus();
			}, 50);
		}
	}, [open]);

	// Close on escape and handle cmd+k
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				onOpenChange(!open);
			}
			if (e.key === "Escape") {
				onOpenChange(false);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [open, onOpenChange]);

	const handleSelect = useCallback(
		(href: string) => {
			router.push(href);
			onOpenChange(false);
			setSearch("");
		},
		[router, onOpenChange]
	);

	// Group tools by category
	const groupedTools = tools.reduce(
		(acc, tool) => {
			if (!acc[tool.category]) {
				acc[tool.category] = [];
			}
			acc[tool.category].push(tool);
			return acc;
		},
		{} as Record<Category, typeof tools>
	);

	return (
		<AnimatePresence>
			{open && (
				<>
					{/* Backdrop */}
					<motion.div
						variants={backdropVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						onClick={() => onOpenChange(false)}
						className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
					/>

					{/* Command Palette */}
					<div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
						<motion.div
							variants={commandPaletteVariants}
							initial="initial"
							animate="animate"
							exit="exit"
							className="w-full max-w-xl"
						>
							<Command
								className={cn(
									"bg-card rounded-xl shadow-2xl border border-border overflow-hidden",
									"ring-1 ring-black/5"
								)}
								loop
								shouldFilter={true}
							>
								{/* Search Input */}
								<div className="flex items-center gap-3 px-4 border-b border-border">
									<Search className="w-5 h-5 text-foreground-muted" />
									<Command.Input
										ref={inputRef}
										value={search}
										onValueChange={setSearch}
										placeholder="Search tools..."
										autoFocus
										className={cn(
											"flex-1 py-4 text-base bg-transparent",
											"text-foreground placeholder:text-foreground-muted/60",
											"focus:outline-none"
										)}
									/>
									<kbd className="px-2 py-1 text-xs font-mono text-foreground-muted bg-background-secondary rounded border border-border">
										ESC
									</kbd>
								</div>

								{/* Results */}
								<Command.List className="max-h-[60vh] overflow-y-auto p-2">
									<Command.Empty className="py-12 text-center text-foreground-muted">
										No tools found.
									</Command.Empty>

									{(Object.entries(groupedTools) as [Category, typeof tools][]).map(
										([category, categoryTools]) => (
											<Command.Group
												key={category}
												heading={categories[category].label}
												className="px-2"
											>
												<div className="text-xs font-medium text-foreground-muted uppercase tracking-wider mb-2 mt-4 first:mt-2">
													{categories[category].label}
												</div>
												{categoryTools.map((tool) => {
													const Icon = getToolIcon(tool.id);
													return (
										<Command.Item
											key={tool.id}
											value={`${tool.name} ${tool.keywords.join(" ")}`}
											onSelect={() => handleSelect(tool.href)}
											className={cn(
												"flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer",
												"text-foreground transition-colors",
												"hover:bg-background-secondary",
												"aria-selected:bg-gradient-to-r aria-selected:from-accent-purple/15 aria-selected:to-accent-pink/15",
												"aria-selected:text-foreground",
												"outline-none"
											)}
										>
															<div
																className={cn(
																	"flex items-center justify-center w-10 h-10 rounded-lg",
																	"bg-gradient-to-br from-accent-purple/10 to-accent-pink/10",
																	"text-primary"
																)}
															>
																<Icon className="w-5 h-5" />
															</div>
															<div className="flex-1 min-w-0">
																<div className="font-medium">{tool.name}</div>
																<div className="text-sm text-foreground-muted truncate">
																	{tool.description}
																</div>
															</div>
															<kbd className="hidden sm:inline px-2 py-1 text-xs font-mono text-foreground-muted bg-background-secondary rounded">
																Enter
															</kbd>
														</Command.Item>
													);
												})}
											</Command.Group>
										)
									)}
								</Command.List>

								{/* Footer hint */}
								<div className="flex items-center justify-between px-4 py-3 border-t border-border bg-background-secondary/50">
									<div className="flex items-center gap-4 text-xs text-foreground-muted">
										<span className="flex items-center gap-1">
											<kbd className="px-1.5 py-0.5 bg-card border border-border rounded">
												↑↓
											</kbd>
											Navigate
										</span>
										<span className="flex items-center gap-1">
											<kbd className="px-1.5 py-0.5 bg-card border border-border rounded">
												↵
											</kbd>
											Select
										</span>
									</div>
									<span className="text-xs text-foreground-muted">
										{tools.length} tools available
									</span>
								</div>
							</Command>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}
