"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyIconButton } from "@/components/ui/copy-button";
import { Shield } from "lucide-react";

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
	const [loading, setLoading] = useState(false);

	const generateHashes = async () => {
		if (!input) return;

		setLoading(true);
		const algorithms: Algorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
		const results: Record<string, string> = {};

		for (const alg of algorithms) {
			results[alg] = await hash(input, alg);
		}

		setHashes(results as Record<Algorithm, string>);
		setLoading(false);
	};

	const hasResults = Object.values(hashes).some((h) => h !== "");

	return (
		<ToolLayout toolId="hash">
			<div className="space-y-6">
				<Textarea
					label="Input Text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Enter text to hash..."
					className="min-h-[120px]"
				/>

				<Button onClick={generateHashes} disabled={!input || loading}>
					{loading ? "Generating..." : "Generate Hashes"}
				</Button>

				<AnimatePresence>
					{hasResults && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							className="space-y-4"
						>
							{(Object.entries(hashes) as [Algorithm, string][]).map(
								([alg, value], index) => (
									<motion.div
										key={alg}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.05 }}
									>
										<Card hover={false}>
											<div className="flex items-center justify-between mb-2">
												<div className="flex items-center gap-2">
													<Shield className="w-4 h-4 text-primary" />
													<span className="font-mono text-sm font-medium text-foreground">
														{alg}
													</span>
												</div>
												{value && <CopyIconButton text={value} />}
											</div>
											<div className="bg-background-secondary rounded-lg p-3 font-mono text-xs break-all text-foreground-muted">
												{value || "—"}
											</div>
										</Card>
									</motion.div>
								)
							)}
						</motion.div>
					)}
				</AnimatePresence>

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
		</ToolLayout>
	);
}
