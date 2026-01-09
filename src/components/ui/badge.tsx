"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: "default" | "gradient" | "outline";
	size?: "sm" | "md";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	({ className, variant = "default", size = "sm", ...props }, ref) => {
		const variants = {
			default: "bg-background-secondary text-foreground-muted",
			gradient:
				"bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 text-primary border border-primary/20",
			outline: "bg-transparent border border-border text-foreground-muted",
		};

		const sizes = {
			sm: "px-2 py-0.5 text-xs",
			md: "px-3 py-1 text-sm",
		};

		return (
			<span
				ref={ref}
				className={cn(
					"inline-flex items-center font-medium rounded-full transition-colors",
					variants[variant],
					sizes[size],
					className
				)}
				{...props}
			/>
		);
	}
);

Badge.displayName = "Badge";

export { Badge };
