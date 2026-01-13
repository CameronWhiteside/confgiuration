"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Clock, Shield, Key } from "lucide-react";
import type { JwtOutput } from "@/lib/services";

interface JwtFormProps {
	initialToken: string;
	initialResult: JwtOutput | null;
	initialError: string | null;
}

export function JwtForm({ initialToken, initialResult, initialError }: JwtFormProps) {
	const [token, setToken] = useState(initialToken);
	const [result, setResult] = useState<JwtOutput | null>(initialResult);
	const [error, setError] = useState(initialError || "");
	const [isPending, startTransition] = useTransition();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		startTransition(async () => {
			try {
				const res = await fetch("/api/jwt/decode", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token }),
				});

				const data = await res.json() as { success: boolean; data?: JwtOutput; error?: string };

				if (data.success && data.data) {
					setResult(data.data);
					setError("");
				} else {
					setError(data.error || "Decode failed");
					setResult(null);
				}
			} catch {
				setError("Request failed");
				setResult(null);
			}
		});
	};

	return (
		<form onSubmit={handleSubmit} method="GET" action="/jwt">
			<div className="space-y-6">
				<Textarea
					label="JWT Token"
					name="token"
					value={token}
					onChange={(e) => setToken(e.target.value)}
					placeholder="Paste your JWT token here..."
					className="min-h-[120px]"
				/>

				<Button type="submit" disabled={!token || isPending}>
					{isPending ? "Decoding..." : "Decode Token"}
				</Button>

				{error && (
					<Card hover={false} className="bg-error-bg border-error/20 p-4">
						<div className="flex items-center gap-3 text-error">
							<AlertCircle className="w-5 h-5 flex-shrink-0" />
							<code className="text-sm">{error}</code>
						</div>
					</Card>
				)}

				{result && (
					<div className="space-y-4">
						{/* Header */}
						<Card hover={false}>
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									<Key className="w-4 h-4 text-primary" />
									<span className="font-medium text-sm">Header</span>
								</div>
								<CopyButton text={JSON.stringify(result.header, null, 2)} variant="ghost" />
							</div>
							<pre className="bg-background-secondary rounded-lg p-3 text-xs font-mono overflow-auto">
								{JSON.stringify(result.header, null, 2)}
							</pre>
						</Card>

						{/* Payload */}
						<Card hover={false}>
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									<Shield className="w-4 h-4 text-primary" />
									<span className="font-medium text-sm">Payload</span>
								</div>
								<CopyButton text={JSON.stringify(result.payload, null, 2)} variant="ghost" />
							</div>
							<pre className="bg-background-secondary rounded-lg p-3 text-xs font-mono overflow-auto">
								{JSON.stringify(result.payload, null, 2)}
							</pre>
						</Card>

						{/* Expiration Status */}
						{result.expiresAt && (
							<Card hover={false} className={result.isExpired ? "border-error/20 bg-error-bg" : "border-success/20 bg-success/5"}>
								<div className="flex items-center gap-3">
									<Clock className={`w-5 h-5 ${result.isExpired ? "text-error" : "text-success"}`} />
									<div>
										<p className={`font-medium ${result.isExpired ? "text-error" : "text-success"}`}>
											{result.isExpired ? "Token Expired" : "Token Valid"}
										</p>
										<p className="text-sm text-foreground-muted">
											{result.isExpired ? "Expired" : "Expires"}: {result.expiresAt}
										</p>
									</div>
								</div>
							</Card>
						)}

						{/* Signature */}
						<Card hover={false}>
							<div className="flex items-center justify-between mb-3">
								<span className="font-medium text-sm text-foreground-muted">Signature</span>
								<CopyButton text={result.signature} variant="ghost" />
							</div>
							<code className="text-xs font-mono text-foreground-muted break-all">
								{result.signature}
							</code>
						</Card>
					</div>
				)}
			</div>
		</form>
	);
}
