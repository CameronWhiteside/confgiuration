"use client";

import { motion } from "framer-motion";
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
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.9, duration: 0.4 }}
			className="flex flex-wrap justify-center gap-2 mb-12"
		>
			{allCategories.map((category) => {
				const isSelected = selectedCategory === category;
				const label = category === "all" ? "All Tools" : categories[category].label;

				return (
					<motion.button
						key={category}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => onSelectCategory(category)}
						className={cn(
							"relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
							isSelected
								? "text-white"
								: "text-foreground-muted hover:text-foreground bg-background-secondary/50 hover:bg-background-secondary border border-transparent hover:border-border"
						)}
					>
						{isSelected && (
							<motion.div
								layoutId="categoryBg"
								className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-purple to-accent-pink"
								transition={{ type: "spring", stiffness: 400, damping: 30 }}
							/>
						)}
						<span className="relative z-10">{label}</span>
					</motion.button>
				);
			})}
		</motion.div>
	);
}
