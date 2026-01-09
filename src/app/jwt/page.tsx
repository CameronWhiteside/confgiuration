"use client";

import { useState } from "react";

interface DecodedJWT {
	header: Record<string, unknown>;
	payload: Record<string, unknown>;
	signature: string;
}

function base64UrlDecode(str: string): string {
	// Replace URL-safe chars and add padding
	const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
	const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
	return atob(padded);
}

function decodeJWT(token: string): DecodedJWT {
	const parts = token.split(".");
	if (parts.length !== 3) {
		throw new Error("Invalid JWT format");
	}

	const header = JSON.parse(base64UrlDecode(parts[0]));
	const payload = JSON.parse(base64UrlDecode(parts[1]));
	const signature = parts[2];

	return { header, payload, signature };
}

function formatTimestamp(value: unknown): string {
	if (typeof value !== "number") return "";
	const date = new Date(value * 1000);
	return date.toLocaleString();
}

export default function JwtPage() {
	const [input, setInput] = useState("");
	const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
	const [error, setError] = useState("");

	const decode = () => {
		setError("");
		setDecoded(null);
		try {
			const result = decodeJWT(input.trim());
			setDecoded(result);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to decode JWT");
		}
	};

	const isExpired = decoded?.payload.exp
		? (decoded.payload.exp as number) * 1000 < Date.now()
		: false;

	return (
		<div>
			<h1 className="font-mono text-2xl font-bold mb-6">JWT Decoder</h1>

			<div className="mb-6">
				<label className="block text-sm text-muted mb-2">JWT Token</label>
				<textarea
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Paste JWT token here..."
					className="w-full h-32 font-mono text-sm"
				/>
			</div>

			<button
				onClick={decode}
				disabled={!input}
				className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-accent-hover disabled:opacity-50 mb-6"
			>
				Decode
			</button>

			{error && (
				<div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm font-mono mb-6">
					{error}
				</div>
			)}

			{decoded && (
				<div className="space-y-6">
					{isExpired && (
						<div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
							This token has expired
						</div>
					)}

					<div>
						<label className="block text-sm text-muted mb-2">Header</label>
						<pre className="p-4 rounded-lg bg-card border border-border overflow-x-auto">
							<code className="text-sm">
								{JSON.stringify(decoded.header, null, 2)}
							</code>
						</pre>
					</div>

					<div>
						<label className="block text-sm text-muted mb-2">Payload</label>
						<pre className="p-4 rounded-lg bg-card border border-border overflow-x-auto">
							<code className="text-sm">
								{JSON.stringify(decoded.payload, null, 2)}
							</code>
						</pre>
						
						{/* Timestamp info */}
						<div className="mt-3 text-sm text-muted space-y-1">
							{typeof decoded.payload.iat === "number" && (
								<div>
									Issued At: {formatTimestamp(decoded.payload.iat)}
								</div>
							)}
							{typeof decoded.payload.exp === "number" && (
								<div>
									Expires: {formatTimestamp(decoded.payload.exp)}
									{isExpired && <span className="text-error ml-2">(expired)</span>}
								</div>
							)}
							{typeof decoded.payload.nbf === "number" && (
								<div>
									Not Before: {formatTimestamp(decoded.payload.nbf)}
								</div>
							)}
						</div>
					</div>

					<div>
						<label className="block text-sm text-muted mb-2">Signature</label>
						<div className="p-4 rounded-lg bg-card border border-border font-mono text-sm break-all">
							{decoded.signature}
						</div>
						<p className="mt-2 text-xs text-muted">
							Signature verification requires the secret key and is not performed here.
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
