"use client";

import { useState } from "react";

type Mode = "env-to-json" | "json-to-env";

export default function EnvPage() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [mode, setMode] = useState<Mode>("env-to-json");

	const convert = () => {
		setError("");
		try {
			if (mode === "env-to-json") {
				const lines = input.split("\n");
				const result: Record<string, string> = {};

				for (const line of lines) {
					const trimmed = line.trim();
					if (!trimmed || trimmed.startsWith("#")) continue;

					const eqIndex = trimmed.indexOf("=");
					if (eqIndex === -1) continue;

					const key = trimmed.slice(0, eqIndex).trim();
					let value = trimmed.slice(eqIndex + 1).trim();

					// Remove surrounding quotes
					if (
						(value.startsWith('"') && value.endsWith('"')) ||
						(value.startsWith("'") && value.endsWith("'"))
					) {
						value = value.slice(1, -1);
					}

					result[key] = value;
				}

				setOutput(JSON.stringify(result, null, 2));
			} else {
				const parsed = JSON.parse(input);
				const lines: string[] = [];

				for (const [key, value] of Object.entries(parsed)) {
					const strValue = String(value);
					const needsQuotes =
						strValue.includes(" ") ||
						strValue.includes("=") ||
						strValue.includes("#");
					lines.push(`${key}=${needsQuotes ? `"${strValue}"` : strValue}`);
				}

				setOutput(lines.join("\n"));
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "Conversion failed");
			setOutput("");
		}
	};

	const copy = () => {
		navigator.clipboard.writeText(output);
	};

	return (
		<div>
			<h1 className="font-mono text-2xl font-bold mb-6">ENV / JSON Converter</h1>

			<div className="flex gap-2 mb-6">
				<button
					onClick={() => setMode("env-to-json")}
					className={`px-4 py-2 rounded-lg font-medium transition-colors ${
						mode === "env-to-json"
							? "bg-accent text-background"
							: "bg-card border border-border text-foreground hover:bg-card-hover"
					}`}
				>
					ENV → JSON
				</button>
				<button
					onClick={() => setMode("json-to-env")}
					className={`px-4 py-2 rounded-lg font-medium transition-colors ${
						mode === "json-to-env"
							? "bg-accent text-background"
							: "bg-card border border-border text-foreground hover:bg-card-hover"
					}`}
				>
					JSON → ENV
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm text-muted mb-2">
						{mode === "env-to-json" ? "ENV Input" : "JSON Input"}
					</label>
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={
							mode === "env-to-json"
								? "DATABASE_URL=postgres://...\nAPI_KEY=secret123"
								: '{\n  "DATABASE_URL": "postgres://...",\n  "API_KEY": "secret123"\n}'
						}
						className="w-full h-80 font-mono text-sm"
					/>
				</div>

				<div>
					<label className="block text-sm text-muted mb-2">
						{mode === "env-to-json" ? "JSON Output" : "ENV Output"}
					</label>
					<textarea
						value={output}
						readOnly
						placeholder="Output will appear here..."
						className="w-full h-80 font-mono text-sm"
					/>
				</div>
			</div>

			{error && (
				<div className="mt-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm font-mono">
					{error}
				</div>
			)}

			<div className="mt-6 flex gap-4">
				<button
					onClick={convert}
					className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-accent-hover"
				>
					Convert
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
