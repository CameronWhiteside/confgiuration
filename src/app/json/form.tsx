"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface JsonFormProps {
	initialInput: string;
	initialOutput: string | null;
	initialError: string | null;
	initialIndent: number;
}

export function JsonForm({ initialInput, initialOutput, initialError, initialIndent }: JsonFormProps) {
	const [input, setInput] = useState(initialInput);
	const [output, setOutput] = useState(initialOutput || "");
	const [error, setError] = useState(initialError || "");
	const [indent, setIndent] = useState(initialIndent);
	const [isPending, startTransition] = useTransition();

	const handleFormat = async (minify: boolean = false) => {
		startTransition(async () => {
			try {
				const res = await fetch("/api/json/format", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ json: input, indent, minify }),
				});

				const data = await res.json() as { success: boolean; data?: { result: string }; error?: string };

				if (data.success && data.data) {
					setOutput(data.data.result);
					setError("");
				} else {
					setError(data.error || "Format failed");
					setOutput("");
				}
			} catch {
				setError("Request failed");
				setOutput("");
			}
		});
	};

	return (
		<form method="GET" action="/json" onSubmit={(e) => { e.preventDefault(); handleFormat(); }}>
			<input type="hidden" name="indent" value={indent} />
			<div className="space-y-6">
				{/* Input/Output Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Textarea
						label="Input"
						name="input"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Paste your JSON here..."
						className="min-h-[300px]"
					/>

					<div>
						<div className="flex items-center justify-between mb-2">
							<label className="block text-sm font-medium text-foreground-muted">
								Output
							</label>
							{output && <CopyButton text={output} variant="ghost" />}
						</div>
						<textarea
							value={output}
							readOnly
							placeholder="Formatted JSON will appear here..."
							className="w-full min-h-[300px] bg-card border border-border rounded-lg px-3 py-3 text-sm font-mono text-foreground placeholder:text-foreground-muted/60 focus:outline-none"
						/>
					</div>
				</div>

				{/* Error Display */}
				{error && (
					<Card hover={false} className="bg-error-bg border-error/20 p-4">
						<div className="flex items-center gap-3 text-error">
							<AlertCircle className="w-5 h-5 flex-shrink-0" />
							<code className="text-sm">{error}</code>
						</div>
					</Card>
				)}

				{/* Controls */}
				<div className="flex flex-wrap items-center gap-4">
					<Select
						label=""
						value={indent}
						onChange={(e) => setIndent(Number(e.target.value))}
						className="w-32"
					>
						<option value={2}>2 spaces</option>
						<option value={4}>4 spaces</option>
						<option value={1}>Tab</option>
					</Select>

					<Button type="submit" disabled={!input || isPending}>
						{isPending ? "Formatting..." : "Format"}
					</Button>

					<Button type="button" variant="secondary" onClick={() => handleFormat(true)} disabled={!input || isPending}>
						Minify
					</Button>
				</div>
			</div>
		</form>
	);
}
