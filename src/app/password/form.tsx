"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CopyIconButton } from "@/components/ui/copy-button";
import { RefreshCw, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PasswordOutput } from "@/lib/services";

interface PasswordFormProps {
	initialLength: number;
	initialCount: number;
	initialUppercase: boolean;
	initialLowercase: boolean;
	initialNumbers: boolean;
	initialSymbols: boolean;
	initialResult: PasswordOutput | null;
}

const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
const strengthColors = ["bg-error", "bg-error", "bg-warning", "bg-warning", "bg-success", "bg-success"];

function getStrengthIndex(strength: PasswordOutput["strength"]): number {
	switch (strength) {
		case "weak": return 1;
		case "medium": return 2;
		case "strong": return 4;
		case "very-strong": return 5;
		default: return 0;
	}
}

export function PasswordForm({
	initialLength,
	initialCount,
	initialUppercase,
	initialLowercase,
	initialNumbers,
	initialSymbols,
	initialResult,
}: PasswordFormProps) {
	const [length, setLength] = useState(initialLength);
	const [count, setCount] = useState(initialCount);
	const [uppercase, setUppercase] = useState(initialUppercase);
	const [lowercase, setLowercase] = useState(initialLowercase);
	const [numbers, setNumbers] = useState(initialNumbers);
	const [symbols, setSymbols] = useState(initialSymbols);
	const [result, setResult] = useState<PasswordOutput | null>(initialResult);
	const [isPending, startTransition] = useTransition();

	const generate = async () => {
		startTransition(async () => {
			try {
				const params = new URLSearchParams({
					length: length.toString(),
					count: count.toString(),
					uppercase: uppercase.toString(),
					lowercase: lowercase.toString(),
					numbers: numbers.toString(),
					symbols: symbols.toString(),
				});

				const res = await fetch(`/api/password/generate?${params}`);
				const data = await res.json() as { success: boolean; data?: PasswordOutput };

				if (data.success && data.data) {
					setResult(data.data);
				}
			} catch {
				// Silent fail
			}
		});
	};

	const noOptionsSelected = !lowercase && !uppercase && !numbers && !symbols;
	const strengthIndex = result ? getStrengthIndex(result.strength) : 0;

	return (
		<form method="GET" action="/password" onSubmit={(e) => { e.preventDefault(); generate(); }}>
			<div className="space-y-6">
				{/* Options Card */}
				<Card hover={false} className="p-4">
					<div className="flex flex-wrap items-end gap-6">
						<div className="w-24">
							<Input
								label="Length"
								name="length"
								type="number"
								min={4}
								max={128}
								value={length}
								onChange={(e) => setLength(Math.min(128, Math.max(4, Number(e.target.value))))}
							/>
						</div>

						<div className="w-20">
							<Input
								label="Count"
								name="count"
								type="number"
								min={1}
								max={20}
								value={count}
								onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value))))}
							/>
						</div>

						<div className="flex flex-wrap gap-2">
							{[
								{ key: "lowercase", label: "a-z", state: lowercase, setter: setLowercase },
								{ key: "uppercase", label: "A-Z", state: uppercase, setter: setUppercase },
								{ key: "numbers", label: "0-9", state: numbers, setter: setNumbers },
								{ key: "symbols", label: "!@#", state: symbols, setter: setSymbols },
							].map(({ key, label, state, setter }) => (
								<button
									key={key}
									type="button"
									onClick={() => setter(!state)}
									className={cn(
										"px-4 py-2 rounded-lg font-mono text-sm transition-colors",
										state
											? "bg-gradient-to-r from-accent-purple to-accent-pink text-white"
											: "bg-background-secondary text-foreground-muted hover:text-foreground"
									)}
								>
									{label}
								</button>
							))}
						</div>

						<Button type="submit" disabled={noOptionsSelected || isPending} className="flex items-center gap-2">
							<RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
							{isPending ? "Generating..." : "Generate"}
						</Button>
					</div>

					{noOptionsSelected && (
						<p className="mt-3 text-sm text-error">
							Select at least one character type
						</p>
					)}
				</Card>

				{/* Strength Indicator */}
				{result && result.passwords.length > 0 && (
					<div className="flex items-center gap-4">
						<span className="text-sm text-foreground-muted">Strength:</span>
						<div className="flex gap-1">
							{[0, 1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className={cn(
										"w-8 h-2 rounded-full transition-colors",
										i <= strengthIndex ? strengthColors[strengthIndex] : "bg-border"
									)}
								/>
							))}
						</div>
						<span className="text-sm font-medium">{strengthLabels[strengthIndex]}</span>
					</div>
				)}

				{/* Password List */}
				{result && result.passwords.length > 0 ? (
					<div className="space-y-2">
						{result.passwords.map((password, i) => (
							<Card key={i} hover={false} className="p-3 flex items-center justify-between group">
								<code className="font-mono text-sm text-foreground break-all">
									{password}
								</code>
								<CopyIconButton text={password} />
							</Card>
						))}
					</div>
				) : (
					<div className="text-center py-16 text-foreground-muted">
						Configure options and click Generate
					</div>
				)}

				{/* Tips */}
				<Card hover={false} className="bg-background-secondary/50 border-dashed">
					<h3 className="font-medium text-foreground mb-2">Password Tips</h3>
					<ul className="text-sm text-foreground-muted space-y-1">
						<li className="flex items-center gap-2">
							<Check className="w-4 h-4 text-success" />
							Use at least 12 characters
						</li>
						<li className="flex items-center gap-2">
							<Check className="w-4 h-4 text-success" />
							Include uppercase, lowercase, numbers, and symbols
						</li>
						<li className="flex items-center gap-2">
							<X className="w-4 h-4 text-error" />
							Never reuse passwords across sites
						</li>
					</ul>
				</Card>
			</div>
		</form>
	);
}
