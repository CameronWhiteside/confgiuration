"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
	text: string;
	className?: string;
	variant?: "default" | "ghost";
}

export function CopyButton({ text, className, variant = "default" }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const variants = {
		default:
			"bg-card border border-border hover:bg-card-hover hover:border-border-hover",
		ghost: "hover:bg-background-secondary",
	};

	return (
		<button
			onClick={handleCopy}
			className={cn(
				"relative inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95",
				variants[variant],
				copied ? "text-success" : "text-foreground-muted hover:text-foreground",
				className
			)}
		>
			{copied ? (
				<span className="flex items-center gap-2">
					<Check className="w-4 h-4" />
					<span>Copied!</span>
				</span>
			) : (
				<span className="flex items-center gap-2">
					<Copy className="w-4 h-4" />
					<span>Copy</span>
				</span>
			)}
		</button>
	);
}

// Smaller icon-only version
interface CopyIconButtonProps {
	text: string;
	className?: string;
}

export function CopyIconButton({ text, className }: CopyIconButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<button
			onClick={handleCopy}
			className={cn(
				"inline-flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150 active:scale-90",
				"hover:bg-background-secondary",
				copied ? "text-success" : "text-foreground-muted hover:text-foreground",
				className
			)}
			title={copied ? "Copied!" : "Copy to clipboard"}
		>
			{copied ? (
				<Check className="w-4 h-4" />
			) : (
				<Copy className="w-4 h-4" />
			)}
		</button>
	);
}
