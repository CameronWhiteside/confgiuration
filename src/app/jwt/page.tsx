"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Clock, AlertTriangle } from "lucide-react";

interface DecodedJWT {
	header: Record<string, unknown>;
	payload: Record<string, unknown>;
	signature: string;
}

function base64UrlDecode(str: string): string {
	const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
	const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
	return atob(padded);
}

function decodeJWT(token: string): DecodedJWT {
	const parts = token.split(".");
	if (parts.length !== 3) {
		throw new Error("Invalid JWT format - must have 3 parts");
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
		<ToolLayout toolId="jwt">
			<div className="space-y-6">
				<Textarea
					label="JWT Token"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
					className="min-h-[120px]"
				/>

				<Button onClick={decode} disabled={!input}>
					Decode
				</Button>

				<AnimatePresence>
					{error && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
						>
							<Card hover={false} className="bg-error-bg border-error/20 p-4">
								<div className="flex items-center gap-3 text-error">
									<AlertCircle className="w-5 h-5 flex-shrink-0" />
									<code className="text-sm">{error}</code>
								</div>
							</Card>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{decoded && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							className="space-y-6"
						>
							{isExpired && (
								<Card hover={false} className="bg-warning-bg border-warning/20 p-4">
									<div className="flex items-center gap-3 text-warning">
										<AlertTriangle className="w-5 h-5 flex-shrink-0" />
										<span className="text-sm font-medium">This token has expired</span>
									</div>
								</Card>
							)}

							{/* Header */}
							<Card hover={false}>
								<div className="flex items-center justify-between mb-3">
									<h3 className="font-mono text-sm font-medium text-foreground-muted uppercase tracking-wider">
										Header
									</h3>
									<CopyButton
										text={JSON.stringify(decoded.header, null, 2)}
										variant="ghost"
									/>
								</div>
								<pre className="bg-background-secondary rounded-lg p-4 overflow-x-auto">
									<code className="text-sm text-foreground">
										{JSON.stringify(decoded.header, null, 2)}
									</code>
								</pre>
							</Card>

							{/* Payload */}
							<Card hover={false}>
								<div className="flex items-center justify-between mb-3">
									<h3 className="font-mono text-sm font-medium text-foreground-muted uppercase tracking-wider">
										Payload
									</h3>
									<CopyButton
										text={JSON.stringify(decoded.payload, null, 2)}
										variant="ghost"
									/>
								</div>
								<pre className="bg-background-secondary rounded-lg p-4 overflow-x-auto mb-4">
									<code className="text-sm text-foreground">
										{JSON.stringify(decoded.payload, null, 2) as string}
									</code>
								</pre>

								{/* Timestamp info */}
								{(decoded.payload.iat !== undefined || decoded.payload.exp !== undefined || decoded.payload.nbf !== undefined) && (
									<div className="border-t border-border pt-4 space-y-2">
										{typeof decoded.payload.iat === "number" && (
											<div className="flex items-center gap-2 text-sm">
												<Clock className="w-4 h-4 text-foreground-muted" />
												<span className="text-foreground-muted">Issued:</span>
												<span className="text-foreground">
													{formatTimestamp(decoded.payload.iat)}
												</span>
											</div>
										)}
										{typeof decoded.payload.exp === "number" && (
											<div className="flex items-center gap-2 text-sm">
												<Clock className="w-4 h-4 text-foreground-muted" />
												<span className="text-foreground-muted">Expires:</span>
												<span className={isExpired ? "text-error" : "text-foreground"}>
													{formatTimestamp(decoded.payload.exp)}
													{isExpired && " (expired)"}
												</span>
											</div>
										)}
										{typeof decoded.payload.nbf === "number" && (
											<div className="flex items-center gap-2 text-sm">
												<Clock className="w-4 h-4 text-foreground-muted" />
												<span className="text-foreground-muted">Not Before:</span>
												<span className="text-foreground">
													{formatTimestamp(decoded.payload.nbf)}
												</span>
											</div>
										)}
									</div>
								)}
							</Card>

							{/* Signature */}
							<Card hover={false}>
								<div className="flex items-center justify-between mb-3">
									<h3 className="font-mono text-sm font-medium text-foreground-muted uppercase tracking-wider">
										Signature
									</h3>
									<CopyButton text={decoded.signature} variant="ghost" />
								</div>
								<div className="bg-background-secondary rounded-lg p-4 font-mono text-sm break-all text-foreground">
									{decoded.signature}
								</div>
								<p className="mt-3 text-xs text-foreground-muted">
									Signature verification requires the secret key and is not performed here.
								</p>
							</Card>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</ToolLayout>
	);
}
