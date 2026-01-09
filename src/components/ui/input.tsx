"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, label, error, id, ...props }, ref) => {
		const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className="w-full">
				{label && (
					<label
						htmlFor={inputId}
						className="block text-sm font-medium text-foreground-muted mb-2"
					>
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={inputId}
					className={cn(
						"w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono",
						"text-foreground placeholder:text-foreground-muted/60",
						"transition-all duration-200",
						"focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10",
						error && "border-error focus:border-error focus:ring-error/10",
						className
					)}
					{...props}
				/>
				{error && (
					<p className="mt-1.5 text-xs text-error">{error}</p>
				)}
			</div>
		);
	}
);

Input.displayName = "Input";

export { Input };
