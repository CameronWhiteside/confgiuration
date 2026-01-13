"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CopyIconButton } from "@/components/ui/copy-button";
import { AlertCircle } from "lucide-react";

type Base = "binary" | "octal" | "decimal" | "hex";

const BASE_INFO: Record<Base, { label: string; prefix: string }> = {
	binary: { label: "Binary", prefix: "0b" },
	octal: { label: "Octal", prefix: "0o" },
	decimal: { label: "Decimal", prefix: "" },
	hex: { label: "Hexadecimal", prefix: "0x" },
};

const BASE_TO_RADIX: Record<Base, number> = {
	binary: 2,
	octal: 8,
	decimal: 10,
	hex: 16,
};

interface ConversionResult {
	binary: string;
	octal: string;
	decimal: string;
	hex: string;
}

interface BaseFormProps {
	initialInput: string;
	initialFromBase: Base;
	initialResult: ConversionResult | null;
	initialError: string | null;
}

export function BaseForm({
	initialInput,
	initialFromBase,
	initialResult,
	initialError,
}: BaseFormProps) {
	const [input, setInput] = useState(initialInput);
	const [fromBase, setFromBase] = useState<Base>(initialFromBase);
	const [result, setResult] = useState<ConversionResult | null>(initialResult);
	const [error, setError] = useState(initialError || "");
	const [isPending, startTransition] = useTransition();

	const bases: Base[] = ["binary", "octal", "decimal", "hex"];

	const handleInputChange = (value: string) => {
		setInput(value);
		if (!value.trim()) {
			setResult(null);
			setError("");
			return;
		}

		startTransition(async () => {
			try {
				const res = await fetch("/api/base/convert", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						value,
						fromBase: BASE_TO_RADIX[fromBase],
					}),
				});

				const data = await res.json() as { success: boolean; data?: ConversionResult; error?: string };

				if (data.success && data.data) {
					setResult(data.data);
					setError("");
				} else {
					setError(data.error || "Conversion failed");
					setResult(null);
				}
			} catch {
				setError("Conversion failed");
				setResult(null);
			}
		});
	};

	const handleBaseChange = (newBase: Base) => {
		setFromBase(newBase);
		if (input.trim()) {
			startTransition(async () => {
				try {
					const res = await fetch("/api/base/convert", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							value: input,
							fromBase: BASE_TO_RADIX[newBase],
						}),
					});

					const data = await res.json() as { success: boolean; data?: ConversionResult; error?: string };

					if (data.success && data.data) {
						setResult(data.data);
						setError("");
					} else {
						setError(data.error || "Conversion failed");
						setResult(null);
					}
				} catch {
					setError("Conversion failed");
					setResult(null);
				}
			});
		}
	};

	return (
		<div className="space-y-6">
			{/* Input */}
			<Card hover={false} className="p-4">
				<form method="GET" action="/base">
					<input type="hidden" name="fromBase" value={fromBase} />
					<div className="flex flex-wrap items-end gap-4">
						<div className="flex-1 min-w-[200px]">
							<Input
								label="Input Number"
								name="input"
								value={input}
								onChange={(e) => handleInputChange(e.target.value)}
								placeholder="Enter a number..."
								className="font-mono"
							/>
						</div>

						<div className="flex gap-2">
							{bases.map((base) => (
								<button
									key={base}
									type="button"
									onClick={() => handleBaseChange(base)}
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
					<noscript>
						<button
							type="submit"
							className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
						>
							Convert
						</button>
					</noscript>
				</form>
			</Card>

			{/* Error */}
			{error && (
				<Card hover={false} className="bg-error-bg border-error/20 p-4">
					<div className="flex items-center gap-3 text-error">
						<AlertCircle className="w-5 h-5" />
						<span>{error}</span>
					</div>
				</Card>
			)}

			{/* Results */}
			{result && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{bases.map((base) => {
						const info = BASE_INFO[base];
						const value = result[base];

						return (
							<Card
								key={base}
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
						);
					})}
				</div>
			)}

			{/* Empty State */}
			{!input.trim() && !isPending && (
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
	);
}
