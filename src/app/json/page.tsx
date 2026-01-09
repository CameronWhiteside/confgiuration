"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function JsonPage() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [indentSize, setIndentSize] = useState(2);

	const format = () => {
		setError("");
		try {
			const parsed = JSON.parse(input);
			setOutput(JSON.stringify(parsed, null, indentSize));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Invalid JSON");
			setOutput("");
		}
	};

	const minify = () => {
		setError("");
		try {
			const parsed = JSON.parse(input);
			setOutput(JSON.stringify(parsed));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Invalid JSON");
			setOutput("");
		}
	};

	return (
		<ToolLayout toolId="json">
			<div className="space-y-6">
				{/* Input/Output Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Textarea
						label="Input"
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
							className="w-full min-h-[300px] bg-card border border-border rounded-lg px-3 py-3 text-sm font-mono text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
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
						value={indentSize}
						onChange={(e) => setIndentSize(Number(e.target.value))}
						className="w-32"
					>
						<option value={2}>2 spaces</option>
						<option value={4}>4 spaces</option>
						<option value={1}>Tab</option>
					</Select>

					<Button onClick={format} disabled={!input}>
						Format
					</Button>

					<Button variant="secondary" onClick={minify} disabled={!input}>
						Minify
					</Button>
				</div>
			</div>
		</ToolLayout>
	);
}
