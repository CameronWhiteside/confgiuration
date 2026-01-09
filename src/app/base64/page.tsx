"use client";

import { useState } from "react";

type Mode = "encode" | "decode";

export default function Base64Page() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [mode, setMode] = useState<Mode>("encode");

	const convert = () => {
		setError("");
		try {
			if (mode === "encode") {
				// Handle unicode properly
				const bytes = new TextEncoder().encode(input);
				const binary = Array.from(bytes)
					.map((b) => String.fromCharCode(b))
					.join("");
				setOutput(btoa(binary));
			} else {
				const binary = atob(input);
				const bytes = new Uint8Array(binary.length);
				for (let i = 0; i < binary.length; i++) {
					bytes[i] = binary.charCodeAt(i);
				}
				setOutput(new TextDecoder().decode(bytes));
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
			<h1 className="font-mono text-2xl font-bold mb-6">Base64</h1>

			<div className="flex gap-2 mb-6">
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

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm text-muted mb-2">
						{mode === "encode" ? "Text Input" : "Base64 Input"}
					</label>
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={
							mode === "encode"
								? "Enter text to encode..."
								: "Enter Base64 to decode..."
						}
						className="w-full h-64 font-mono text-sm"
					/>
				</div>

				<div>
					<label className="block text-sm text-muted mb-2">
						{mode === "encode" ? "Base64 Output" : "Text Output"}
					</label>
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
