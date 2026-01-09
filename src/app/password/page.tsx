"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CopyIconButton } from "@/components/ui/copy-button";
import { RefreshCw, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

interface Options {
	length: number;
	lowercase: boolean;
	uppercase: boolean;
	numbers: boolean;
	symbols: boolean;
}

function generatePassword(options: Options): string {
	let charset = "";
	if (options.lowercase) charset += LOWERCASE;
	if (options.uppercase) charset += UPPERCASE;
	if (options.numbers) charset += NUMBERS;
	if (options.symbols) charset += SYMBOLS;

	if (!charset) return "";

	const array = new Uint32Array(options.length);
	crypto.getRandomValues(array);

	return Array.from(array)
		.map((n) => charset[n % charset.length])
		.join("");
}

function calculateStrength(password: string, options: Options): number {
	let score = 0;
	if (password.length >= 8) score += 1;
	if (password.length >= 12) score += 1;
	if (password.length >= 16) score += 1;
	if (options.lowercase && options.uppercase) score += 1;
	if (options.numbers) score += 1;
	if (options.symbols) score += 1;
	return Math.min(score, 5);
}

const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
const strengthColors = [
	"bg-error",
	"bg-error",
	"bg-warning",
	"bg-warning",
	"bg-success",
	"bg-success",
];

export default function PasswordPage() {
	const [passwords, setPasswords] = useState<string[]>([]);
	const [count, setCount] = useState(1);
	const [options, setOptions] = useState<Options>({
		length: 16,
		lowercase: true,
		uppercase: true,
		numbers: true,
		symbols: true,
	});

	const generate = useCallback(() => {
		const newPasswords: string[] = [];
		for (let i = 0; i < count; i++) {
			newPasswords.push(generatePassword(options));
		}
		setPasswords(newPasswords);
	}, [count, options]);

	const strength = passwords[0] ? calculateStrength(passwords[0], options) : 0;

	const toggleOption = (key: keyof Omit<Options, "length">) => {
		setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const noOptionsSelected =
		!options.lowercase && !options.uppercase && !options.numbers && !options.symbols;

	return (
		<ToolLayout toolId="password">
			<div className="space-y-6">
				{/* Options Card */}
				<Card hover={false} className="p-4">
					<div className="flex flex-wrap items-end gap-6">
						<div className="w-24">
							<Input
								label="Length"
								type="number"
								min={4}
								max={128}
								value={options.length}
								onChange={(e) =>
									setOptions((prev) => ({
										...prev,
										length: Math.min(128, Math.max(4, Number(e.target.value))),
									}))
								}
							/>
						</div>

						<div className="w-20">
							<Input
								label="Count"
								type="number"
								min={1}
								max={20}
								value={count}
								onChange={(e) =>
									setCount(Math.min(20, Math.max(1, Number(e.target.value))))
								}
							/>
						</div>

						<div className="flex flex-wrap gap-2">
							{[
								{ key: "lowercase" as const, label: "a-z" },
								{ key: "uppercase" as const, label: "A-Z" },
								{ key: "numbers" as const, label: "0-9" },
								{ key: "symbols" as const, label: "!@#" },
							].map(({ key, label }) => (
								<button
									key={key}
									onClick={() => toggleOption(key)}
									className={cn(
										"px-4 py-2 rounded-lg font-mono text-sm transition-colors",
										options[key]
											? "bg-gradient-to-r from-accent-purple to-accent-pink text-white"
											: "bg-background-secondary text-foreground-muted hover:text-foreground"
									)}
								>
									{label}
								</button>
							))}
						</div>

						<Button
							onClick={generate}
							disabled={noOptionsSelected}
							className="flex items-center gap-2"
						>
							<RefreshCw className="w-4 h-4" />
							Generate
						</Button>
					</div>

					{noOptionsSelected && (
						<p className="mt-3 text-sm text-error">
							Select at least one character type
						</p>
					)}
				</Card>

				{/* Strength Indicator */}
				{passwords.length > 0 && (
					<div className="flex items-center gap-4">
						<span className="text-sm text-foreground-muted">Strength:</span>
						<div className="flex gap-1">
							{[0, 1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className={cn(
										"w-8 h-2 rounded-full transition-colors",
										i <= strength ? strengthColors[strength] : "bg-border"
									)}
								/>
							))}
						</div>
						<span className="text-sm font-medium">{strengthLabels[strength]}</span>
					</div>
				)}

				{/* Password List */}
				{passwords.length > 0 ? (
					<div className="space-y-2">
						{passwords.map((password, i) => (
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
		</ToolLayout>
	);
}
