"use client";

import { useState } from "react";

function generateUUIDv4(): string {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

function generateUUIDv7(): string {
	const timestamp = Date.now();
	const timestampHex = timestamp.toString(16).padStart(12, "0");

	const randomBytes = new Uint8Array(10);
	crypto.getRandomValues(randomBytes);

	// Set version (7) and variant bits
	randomBytes[0] = (randomBytes[0] & 0x0f) | 0x70;
	randomBytes[2] = (randomBytes[2] & 0x3f) | 0x80;

	const randomHex = Array.from(randomBytes)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return `${timestampHex.slice(0, 8)}-${timestampHex.slice(8, 12)}-${randomHex.slice(0, 4)}-${randomHex.slice(4, 8)}-${randomHex.slice(8, 20)}`;
}

export default function UuidPage() {
	const [uuids, setUuids] = useState<string[]>([]);
	const [version, setVersion] = useState<"v4" | "v7">("v4");
	const [count, setCount] = useState(1);

	const generate = () => {
		const newUuids: string[] = [];
		const generator = version === "v4" ? generateUUIDv4 : generateUUIDv7;
		for (let i = 0; i < count; i++) {
			newUuids.push(generator());
		}
		setUuids(newUuids);
	};

	const copy = (uuid: string) => {
		navigator.clipboard.writeText(uuid);
	};

	const copyAll = () => {
		navigator.clipboard.writeText(uuids.join("\n"));
	};

	return (
		<div>
			<h1 className="font-mono text-2xl font-bold mb-6">UUID Generator</h1>

			<div className="flex flex-wrap gap-4 mb-6 items-center">
				<div className="flex gap-2">
					<button
						onClick={() => setVersion("v4")}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							version === "v4"
								? "bg-accent text-background"
								: "bg-card border border-border text-foreground hover:bg-card-hover"
						}`}
					>
						v4 (random)
					</button>
					<button
						onClick={() => setVersion("v7")}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							version === "v7"
								? "bg-accent text-background"
								: "bg-card border border-border text-foreground hover:bg-card-hover"
						}`}
					>
						v7 (timestamp)
					</button>
				</div>

				<div className="flex items-center gap-2">
					<label className="text-sm text-muted">Count:</label>
					<input
						type="number"
						min={1}
						max={100}
						value={count}
						onChange={(e) =>
							setCount(Math.min(100, Math.max(1, Number(e.target.value))))
						}
						className="w-20 px-2 py-1 text-sm"
					/>
				</div>

				<button
					onClick={generate}
					className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-accent-hover"
				>
					Generate
				</button>

				{uuids.length > 1 && (
					<button
						onClick={copyAll}
						className="px-4 py-2 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-card-hover"
					>
						Copy All
					</button>
				)}
			</div>

			{uuids.length > 0 && (
				<div className="space-y-2">
					{uuids.map((uuid, i) => (
						<div
							key={i}
							className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border group"
						>
							<code className="flex-1 font-mono text-sm">{uuid}</code>
							<button
								onClick={() => copy(uuid)}
								className="px-3 py-1 text-sm text-muted hover:text-foreground bg-background rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity"
							>
								Copy
							</button>
						</div>
					))}
				</div>
			)}

			{uuids.length === 0 && (
				<div className="text-center py-16 text-muted">
					Click Generate to create UUIDs
				</div>
			)}
		</div>
	);
}
