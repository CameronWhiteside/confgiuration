"use client";

import { useState } from "react";
import { Search, Command } from "lucide-react";
import { CommandPalette } from "@/components/layout/command-palette";
import { cn } from "@/lib/utils";

export function HomeClient() {
	const [searchOpen, setSearchOpen] = useState(false);

	return (
		<>
			{/* Search button */}
			<button
				onClick={() => setSearchOpen(true)}
				className={cn(
					"inline-flex items-center gap-3 px-6 py-3 rounded-xl",
					"bg-card border border-border",
					"hover:border-primary/50 hover:shadow-lg",
					"text-foreground-muted transition-all duration-200",
					"mx-auto"
				)}
			>
				<Search className="w-5 h-5" />
				<span className="text-base">Search all tools...</span>
				<kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-background-secondary rounded border border-border">
					<Command className="w-3 h-3" />K
				</kbd>
			</button>

			{/* Command palette */}
			<CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
		</>
	);
}
