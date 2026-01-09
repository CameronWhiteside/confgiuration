"use client";

import { useState } from "react";
import { HeroBackground } from "@/components/home/hero-background";
import { Hero } from "@/components/home/hero";
import { CategoryFilter } from "@/components/home/category-filter";
import { ToolGrid } from "@/components/home/tool-grid";
import { CommandPalette } from "@/components/layout/command-palette";
import { type Category } from "@/lib/tools";

export default function Home() {
	const [searchOpen, setSearchOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");

	return (
		<div className="relative">
			{/* Animated background */}
			<HeroBackground />

			{/* Content */}
			<div className="relative z-10">
				<Hero onOpenSearch={() => setSearchOpen(true)} />
				<CategoryFilter
					selectedCategory={selectedCategory}
					onSelectCategory={setSelectedCategory}
				/>
				<ToolGrid selectedCategory={selectedCategory} />
			</div>

			{/* Command palette (backup for hero search button) */}
			<CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
		</div>
	);
}
