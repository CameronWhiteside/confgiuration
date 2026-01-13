"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyIconButton } from "@/components/ui/copy-button";
import { Shield, AlertCircle } from "lucide-react";
import type { HashAlgorithm } from "@/lib/services";

interface HashFormProps {
	initialText: string;
	initialHashes: Record<string, string> | null;
	initialError: string | null;
}

const ALGORITHMS: HashAlgorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

export function HashForm({ initialText, initialHashes, initialError }: HashFormProps) {
	const [text, setText] = useState(initialText);
	const [hashes, setHashes] = useState<Record<string, string>>(
		initialHashes || { "SHA-1": "", "SHA-256": "", "SHA-384": "", "SHA-512": "" }
	);
	const [error, setError] = useState(initialError || "");
	const [isPending, startTransition] = useTransition();

	const generateHashes = async () => {
		if (!text) return;

		startTransition(async () => {
			try {
				const res = await fetch("/api/hash/generate", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ text, allAlgorithms: true }),
				});

				const data = await res.json() as { success: boolean; data?: { hashes: Record<string, string> }; error?: string };

				if (data.success && data.data) {
					setHashes(data.data.hashes);
					setError("");
				} else {
					setError(data.error || "Hash generation failed");
				}
			} catch {
				setError("Request failed");
			}
		});
	};

	const hasResults = Object.values(hashes).some((h) => h !== "");

	return (
		<form method="GET" action="/hash" onSubmit={(e) => { e.preventDefault(); generateHashes(); }}>
			<div className="space-y-6">
				<Textarea
					label="Input Text"
					name="text"
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Enter text to hash..."
					className="min-h-[120px]"
				/>

				<Button type="submit" disabled={!text || isPending}>
					{isPending ? "Generating..." : "Generate Hashes"}
				</Button>

				{error && (
					<Card hover={false} className="bg-error-bg border-error/20 p-4">
						<div className="flex items-center gap-3 text-error">
							<AlertCircle className="w-5 h-5 flex-shrink-0" />
							<code className="text-sm">{error}</code>
						</div>
					</Card>
				)}

				{hasResults && (
					<div className="space-y-4">
						{ALGORITHMS.map((alg) => (
							<Card key={alg} hover={false}>
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<Shield className="w-4 h-4 text-primary" />
										<span className="font-mono text-sm font-medium text-foreground">
											{alg}
										</span>
									</div>
									{hashes[alg] && <CopyIconButton text={hashes[alg]} />}
								</div>
								<div className="bg-background-secondary rounded-lg p-3 font-mono text-xs break-all text-foreground-muted">
									{hashes[alg] || "—"}
								</div>
							</Card>
						))}
					</div>
				)}

				{!hasResults && (
					<Card hover={false} className="bg-background-secondary/50 border-dashed">
						<div className="flex items-center gap-3 text-foreground-muted">
							<Shield className="w-5 h-5" />
							<div>
								<p className="font-medium text-foreground">About SHA Hashing</p>
								<p className="text-sm mt-1">
									SHA (Secure Hash Algorithm) produces a fixed-size hash value from input text.
									SHA-256 is commonly used for security applications.
								</p>
							</div>
						</div>
					</Card>
				)}
			</div>
		</form>
	);
}
