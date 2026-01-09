"use client";

import { useState } from "react";
import YAML from "yaml";

type Mode = "yaml-to-json" | "json-to-yaml";

export default function YamlPage() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [mode, setMode] = useState<Mode>("yaml-to-json");

	const convert = () => {
		setError("");
		try {
			if (mode === "yaml-to-json") {
				const parsed = YAML.parse(input);
				setOutput(JSON.stringify(parsed, null, 2));
			} else {
				const parsed = JSON.parse(input);
				setOutput(YAML.stringify(parsed, { indent: 2 }));
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
			<h1 className="font-mono text-2xl font-bold mb-6">YAML / JSON Converter</h1>

			<div className="flex gap-2 mb-6">
				<button
					onClick={() => setMode("yaml-to-json")}
					className={`px-4 py-2 rounded-lg font-medium transition-colors ${
						mode === "yaml-to-json"
							? "bg-accent text-background"
							: "bg-card border border-border text-foreground hover:bg-card-hover"
					}`}
				>
					YAML → JSON
				</button>
				<button
					onClick={() => setMode("json-to-yaml")}
					className={`px-4 py-2 rounded-lg font-medium transition-colors ${
						mode === "json-to-yaml"
							? "bg-accent text-background"
							: "bg-card border border-border text-foreground hover:bg-card-hover"
					}`}
				>
					JSON → YAML
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm text-muted mb-2">
						{mode === "yaml-to-json" ? "YAML Input" : "JSON Input"}
					</label>
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={
							mode === "yaml-to-json"
								? "name: John\nage: 30\nitems:\n  - one\n  - two"
								: '{\n  "name": "John",\n  "age": 30\n}'
						}
						className="w-full h-80 font-mono text-sm"
					/>
				</div>

				<div>
					<label className="block text-sm text-muted mb-2">
						{mode === "yaml-to-json" ? "JSON Output" : "YAML Output"}
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
