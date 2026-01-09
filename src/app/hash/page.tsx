"use client";

import { useState } from "react";

type Algorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

async function hash(text: string, algorithm: Algorithm): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(text);
	const hashBuffer = await crypto.subtle.digest(algorithm, data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashPage() {
	const [input, setInput] = useState("");
	const [hashes, setHashes] = useState<Record<Algorithm, string>>({
		"SHA-1": "",
		"SHA-256": "",
		"SHA-384": "",
		"SHA-512": "",
	});

	const generateHashes = async () => {
		if (!input) return;

		const algorithms: Algorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
		const results: Record<string, string> = {};

		for (const alg of algorithms) {
			results[alg] = await hash(input, alg);
		}

		setHashes(results as Record<Algorithm, string>);
	};

	const copy = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	return (
		<div>
			<h1 className="font-mono text-2xl font-bold mb-6">Hash Generator</h1>

			<div className="mb-6">
				<label className="block text-sm text-muted mb-2">Input Text</label>
				<textarea
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Enter text to hash..."
					className="w-full h-32 font-mono text-sm"
				/>
			</div>

			<button
				onClick={generateHashes}
				disabled={!input}
				className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-accent-hover disabled:opacity-50 mb-6"
			>
				Generate Hashes
			</button>

			<div className="space-y-4">
				{(Object.entries(hashes) as [Algorithm, string][]).map(
					([alg, value]) => (
						<div key={alg}>
							<label className="block text-sm text-muted mb-2">{alg}</label>
							<div className="flex items-center gap-2">
								<input
									type="text"
									value={value}
									readOnly
									placeholder="Hash will appear here..."
									className="flex-1 font-mono text-sm"
								/>
								<button
									onClick={() => copy(value)}
									disabled={!value}
									className="px-3 py-2 bg-card border border-border text-foreground rounded-lg text-sm hover:bg-card-hover disabled:opacity-50"
								>
									Copy
								</button>
							</div>
						</div>
					)
				)}
			</div>

			<div className="mt-8 p-4 rounded-lg bg-card border border-border text-sm text-muted">
				<p className="font-medium text-foreground mb-2">Note</p>
				<p>
					MD5 is not available in Web Crypto API. For legacy MD5 hashing,
					consider using a dedicated library.
				</p>
			</div>
		</div>
	);
}
