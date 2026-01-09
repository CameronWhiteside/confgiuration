"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ className, label, id, children, ...props }, ref) => {
		const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className="w-full">
				{label && (
					<label
						htmlFor={selectId}
						className="block text-sm font-medium text-foreground-muted mb-2"
					>
						{label}
					</label>
				)}
				<select
					ref={ref}
					id={selectId}
					className={cn(
						"w-full bg-card border border-border rounded-lg px-3 py-2 text-sm",
						"text-foreground cursor-pointer appearance-none",
						"transition-all duration-200",
						"focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10",
						"bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]",
						"bg-no-repeat bg-[right_0.75rem_center]",
						"pr-10",
						className
					)}
					{...props}
				>
					{children}
				</select>
			</div>
		);
	}
);

Select.displayName = "Select";

export { Select };
