"use client";

import { useState } from "react";

type Mode = "encode" | "decode";

export default function UrlPage() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [mode, setMode] = useState<Mode>("encode");
	const [encodeComponent, setEncodeComponent] = useState(true);

	const convert = () => {
		setError("");
		try {
			if (mode === "encode") {
				setOutput(
					encodeComponent ? encodeURIComponent(input) : encodeURI(input)
				);
			} else {
				setOutput(
					encodeComponent ? decodeURIComponent(input) : decodeURI(input)
				);
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
			<h1 className="font-mono text-2xl font-bold mb-6">URL Encode/Decode</h1>

			<div className="flex flex-wrap gap-4 mb-6">
				<div className="flex gap-2">
					<button
						onClick={() => setMode("encode")}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							mode === "encode"
								? "bg-accent text-background"
								: "bg-card border border-border text-foreground hover:bg-card-hover"
						}`}
					>
						Encode
					</button>
					<button
						onClick={() => setMode("decode")}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							mode === "decode"
								? "bg-accent text-background"
								: "bg-card border border-border text-foreground hover:bg-card-hover"
						}`}
					>
						Decode
					</button>
				</div>

				<label className="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						checked={encodeComponent}
						onChange={(e) => setEncodeComponent(e.target.checked)}
						className="rounded"
					/>
					<span className="text-muted">Component mode (encode all special chars)</span>
				</label>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm text-muted mb-2">Input</label>
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={
							mode === "encode"
								? "hello world & foo=bar"
								: "hello%20world%20%26%20foo%3Dbar"
						}
						className="w-full h-64 font-mono text-sm"
					/>
				</div>

				<div>
					<label className="block text-sm text-muted mb-2">Output</label>
					<textarea
						value={output}
						readOnly
						placeholder="Output will appear here..."
						className="w-full h-64 font-mono text-sm"
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
					{mode === "encode" ? "Encode" : "Decode"}
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
