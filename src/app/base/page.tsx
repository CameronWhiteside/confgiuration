"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CopyIconButton } from "@/components/ui/copy-button";
import { AlertCircle } from "lucide-react";

interface ConversionResult {
	binary: string;
	octal: string;
	decimal: string;
	hex: string;
}

type Base = "binary" | "octal" | "decimal" | "hex";

const BASE_INFO: Record<Base, { label: string; radix: number; prefix: string; pattern: RegExp }> = {
	binary: { label: "Binary", radix: 2, prefix: "0b", pattern: /^[01]+$/ },
	octal: { label: "Octal", radix: 8, prefix: "0o", pattern: /^[0-7]+$/ },
	decimal: { label: "Decimal", radix: 10, prefix: "", pattern: /^[0-9]+$/ },
	hex: { label: "Hexadecimal", radix: 16, prefix: "0x", pattern: /^[0-9a-fA-F]+$/ },
};

function convert(value: string, fromBase: Base): ConversionResult | null {
	if (!value.trim()) return null;

	const { radix, pattern } = BASE_INFO[fromBase];
	const cleanValue = value.replace(/^(0b|0o|0x)/i, "").trim();

	if (!pattern.test(cleanValue)) return null;

	try {
		const decimal = parseInt(cleanValue, radix);
		if (isNaN(decimal) || decimal < 0) return null;

		return {
			binary: decimal.toString(2),
			octal: decimal.toString(8),
			decimal: decimal.toString(10),
			hex: decimal.toString(16).toUpperCase(),
		};
	} catch {
		return null;
	}
}

export default function BasePage() {
	const [input, setInput] = useState("255");
	const [fromBase, setFromBase] = useState<Base>("decimal");

	const result = useMemo(() => convert(input, fromBase), [input, fromBase]);
	const isValid = result !== null || !input.trim();

	const bases: Base[] = ["binary", "octal", "decimal", "hex"];

	return (
		<ToolLayout toolId="base">
			<div className="space-y-6">
				{/* Input */}
				<Card hover={false} className="p-4">
					<div className="flex flex-wrap items-end gap-4">
						<div className="flex-1 min-w-[200px]">
							<Input
								label="Input Number"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Enter a number..."
								className="font-mono"
							/>
						</div>

						<div className="flex gap-2">
							{bases.map((base) => (
								<button
									key={base}
									onClick={() => setFromBase(base)}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
										fromBase === base
											? "bg-gradient-to-r from-accent-purple to-accent-pink text-white"
											: "bg-background-secondary text-foreground-muted hover:text-foreground"
									}`}
								>
									{BASE_INFO[base].label}
								</button>
							))}
						</div>
					</div>
				</Card>

				{/* Error */}
				<AnimatePresence>
					{!isValid && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
						>
							<Card hover={false} className="bg-error-bg border-error/20 p-4">
								<div className="flex items-center gap-3 text-error">
									<AlertCircle className="w-5 h-5" />
									<span>
										Invalid {BASE_INFO[fromBase].label.toLowerCase()} number
									</span>
								</div>
							</Card>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Results */}
				<AnimatePresence>
					{result && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							className="grid grid-cols-1 md:grid-cols-2 gap-4"
						>
							{bases.map((base) => {
								const info = BASE_INFO[base];
								const value = result[base];

								return (
									<motion.div
										key={base}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: bases.indexOf(base) * 0.05 }}
									>
										<Card
											hover={false}
											className={fromBase === base ? "ring-2 ring-primary/50" : ""}
										>
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium text-foreground-muted">
													{info.label}
												</span>
												<CopyIconButton text={value} />
											</div>
											<div className="bg-background-secondary rounded-lg p-3 font-mono text-lg break-all">
												{info.prefix && (
													<span className="text-foreground-muted">{info.prefix}</span>
												)}
												<span className="text-foreground">{value}</span>
											</div>
											{fromBase === base && (
												<span className="text-xs text-primary mt-2 block">
													Input base
												</span>
											)}
										</Card>
									</motion.div>
								);
							})}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Empty State */}
				{!input.trim() && (
					<div className="text-center py-12 text-foreground-muted">
						Enter a number to convert between bases
					</div>
				)}

				{/* Reference */}
				<Card hover={false} className="bg-background-secondary/50 border-dashed">
					<h3 className="font-medium text-foreground mb-3">Quick Reference</h3>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
						<div>
							<div className="font-mono text-foreground">Binary (2)</div>
							<div className="text-foreground-muted">0, 1</div>
						</div>
						<div>
							<div className="font-mono text-foreground">Octal (8)</div>
							<div className="text-foreground-muted">0-7</div>
						</div>
						<div>
							<div className="font-mono text-foreground">Decimal (10)</div>
							<div className="text-foreground-muted">0-9</div>
						</div>
						<div>
							<div className="font-mono text-foreground">Hex (16)</div>
							<div className="text-foreground-muted">0-9, A-F</div>
						</div>
					</div>
				</Card>
			</div>
		</ToolLayout>
	);
}
