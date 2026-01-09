"use client";

import { cn } from "@/lib/utils";
import { categories, type Category } from "@/lib/tools";

interface CategoryFilterProps {
	selectedCategory: Category | "all";
	onSelectCategory: (category: Category | "all") => void;
}

export function CategoryFilter({
	selectedCategory,
	onSelectCategory,
}: CategoryFilterProps) {
	const allCategories: (Category | "all")[] = [
		"all",
		...(Object.keys(categories) as Category[]),
	];

	return (
		<div className="flex flex-wrap justify-center gap-2 mb-12">
			{allCategories.map((category) => {
				const isSelected = selectedCategory === category;
				const label = category === "all" ? "All Tools" : categories[category].label;

				return (
					<button
						key={category}
						onClick={() => onSelectCategory(category)}
						className={cn(
							"relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-150 active:scale-95",
							isSelected
								? "text-white bg-gradient-to-r from-accent-purple to-accent-pink"
								: "text-foreground-muted hover:text-foreground bg-background-secondary/50 hover:bg-background-secondary border border-transparent hover:border-border"
						)}
					>
						{label}
					</button>
				);
			})}
		</div>
	);
}
