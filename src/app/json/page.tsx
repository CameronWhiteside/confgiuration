"use client";

import { useState } from "react";

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

	const copy = () => {
		navigator.clipboard.writeText(output);
	};

	return (
		<div>
			<h1 className="font-mono text-2xl font-bold mb-6">JSON Formatter</h1>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm text-muted mb-2">Input</label>
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Paste JSON here..."
						className="w-full h-80 font-mono text-sm"
					/>
				</div>

				<div>
					<label className="block text-sm text-muted mb-2">Output</label>
					<textarea
						value={output}
						readOnly
						placeholder="Formatted JSON will appear here..."
						className="w-full h-80 font-mono text-sm"
					/>
				</div>
			</div>

			{error && (
				<div className="mt-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm font-mono">
					{error}
				</div>
			)}

			<div className="mt-6 flex flex-wrap items-center gap-4">
				<div className="flex items-center gap-2">
					<label className="text-sm text-muted">Indent:</label>
					<select
						value={indentSize}
						onChange={(e) => setIndentSize(Number(e.target.value))}
						className="bg-card border border-border rounded px-2 py-1 text-sm"
					>
						<option value={2}>2 spaces</option>
						<option value={4}>4 spaces</option>
						<option value={1}>Tab</option>
					</select>
				</div>

				<button
					onClick={format}
					className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-accent-hover"
				>
					Format
				</button>

				<button
					onClick={minify}
					className="px-4 py-2 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-card-hover"
				>
					Minify
				</button>

				<button
					onClick={copy}
					disabled={!output}
					className="px-4 py-2 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-card-hover disabled:opacity-50"
				>
					Copy
				</button>
			</div>
		</div>
	);
}
