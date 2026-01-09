"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiffMatchPatch from "diff-match-patch";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GitCompare } from "lucide-react";

export default function DiffPage() {
	const [textA, setTextA] = useState("");
	const [textB, setTextB] = useState("");
	const [diff, setDiff] = useState<[number, string][]>([]);

	const compare = () => {
		const dmp = new DiffMatchPatch();
		const diffs = dmp.diff_main(textA, textB);
		dmp.diff_cleanupSemantic(diffs);
		setDiff(diffs);
	};

	const clear = () => {
		setTextA("");
		setTextB("");
		setDiff([]);
	};

	const stats = diff.reduce(
		(acc, [type, text]) => {
			if (type === -1) acc.removed += text.length;
			if (type === 1) acc.added += text.length;
			return acc;
		},
		{ added: 0, removed: 0 }
	);

	return (
		<ToolLayout toolId="diff">
			<div className="space-y-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Textarea
						label="Original"
						value={textA}
						onChange={(e) => setTextA(e.target.value)}
						placeholder="Enter original text..."
						className="min-h-[250px]"
					/>

					<Textarea
						label="Modified"
						value={textB}
						onChange={(e) => setTextB(e.target.value)}
						placeholder="Enter modified text..."
						className="min-h-[250px]"
					/>
				</div>

				<div className="flex gap-4">
					<Button onClick={compare} disabled={!textA && !textB}>
						<GitCompare className="w-4 h-4 mr-2" />
						Compare
					</Button>

					{(textA || textB) && (
						<Button variant="secondary" onClick={clear}>
							Clear
						</Button>
					)}
				</div>

				<AnimatePresence>
					{diff.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							className="space-y-4"
						>
							{/* Stats */}
							<div className="flex gap-4 text-sm">
								<span className="text-success">+{stats.added} added</span>
								<span className="text-error">-{stats.removed} removed</span>
							</div>

							{/* Diff Result */}
							<Card hover={false}>
								<h3 className="font-mono text-sm font-medium text-foreground-muted uppercase tracking-wider mb-3">
									Diff Result
								</h3>
								<div className="bg-background-secondary rounded-lg p-4 font-mono text-sm whitespace-pre-wrap break-all leading-relaxed">
									{diff.map(([type, text], i) => {
										if (type === 0) {
											return <span key={i}>{text}</span>;
										} else if (type === -1) {
											return (
												<span
													key={i}
													className="bg-error/20 text-error line-through decoration-error/50"
												>
													{text}
												</span>
											);
										} else {
											return (
												<span key={i} className="bg-success/20 text-success">
													{text}
												</span>
											);
										}
									})}
								</div>
							</Card>
						</motion.div>
					)}
				</AnimatePresence>

				{diff.length === 0 && !textA && !textB && (
					<div className="text-center py-16 text-foreground-muted">
						Enter text in both fields and click Compare
					</div>
				)}
			</div>
		</ToolLayout>
	);
}
