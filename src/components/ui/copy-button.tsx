"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={handleCopy}
			className={cn(
				"relative inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
				variants[variant],
				copied ? "text-success" : "text-foreground-muted hover:text-foreground",
				className
			)}
		>
			<AnimatePresence mode="wait" initial={false}>
				{copied ? (
					<motion.span
						key="check"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						className="flex items-center gap-2"
					>
						<Check className="w-4 h-4" />
						<span>Copied!</span>
					</motion.span>
				) : (
					<motion.span
						key="copy"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						className="flex items-center gap-2"
					>
						<Copy className="w-4 h-4" />
						<span>Copy</span>
					</motion.span>
				)}
			</AnimatePresence>
		</motion.button>
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
		<motion.button
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
			onClick={handleCopy}
			className={cn(
				"inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors",
				"hover:bg-background-secondary",
				copied ? "text-success" : "text-foreground-muted hover:text-foreground",
				className
			)}
			title={copied ? "Copied!" : "Copy to clipboard"}
		>
			<AnimatePresence mode="wait" initial={false}>
				{copied ? (
					<motion.div
						key="check"
						initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
						animate={{ opacity: 1, scale: 1, rotate: 0 }}
						exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
						transition={{ duration: 0.15 }}
					>
						<Check className="w-4 h-4" />
					</motion.div>
				) : (
					<motion.div
						key="copy"
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5 }}
						transition={{ duration: 0.15 }}
					>
						<Copy className="w-4 h-4" />
					</motion.div>
				)}
			</AnimatePresence>
		</motion.button>
	);
}
