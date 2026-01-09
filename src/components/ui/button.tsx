"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = "primary", size = "md", children, ...props }, ref) => {
		const baseStyles =
			"inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-ring disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

		const variants = {
			primary:
				"bg-gradient-to-r from-accent-purple to-accent-pink text-white hover:opacity-90 shadow-md hover:shadow-lg",
			secondary:
				"bg-card border border-border text-foreground hover:bg-card-hover hover:border-border-hover",
			ghost:
				"bg-transparent text-foreground-muted hover:text-foreground hover:bg-background-secondary",
			danger:
				"bg-error text-white hover:bg-error/90",
		};

		const sizes = {
			sm: "px-3 py-1.5 text-sm gap-1.5",
			md: "px-4 py-2 text-sm gap-2",
			lg: "px-6 py-3 text-base gap-2",
		};

		return (
			<button
				ref={ref}
				className={cn(baseStyles, variants[variant], sizes[size], className)}
				{...props}
			>
				{children}
			</button>
		);
	}
);

Button.displayName = "Button";

export { Button };
