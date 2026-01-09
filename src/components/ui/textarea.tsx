"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, label, error, id, ...props }, ref) => {
		const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className="w-full">
				{label && (
					<label
						htmlFor={textareaId}
						className="block text-sm font-medium text-foreground-muted mb-2"
					>
						{label}
					</label>
				)}
				<textarea
					ref={ref}
					id={textareaId}
					className={cn(
						"w-full bg-card border border-border rounded-lg px-3 py-3 text-sm font-mono",
						"text-foreground placeholder:text-foreground-muted/60",
						"transition-all duration-200 resize-y min-h-[120px]",
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

Textarea.displayName = "Textarea";

export { Textarea };
