"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GitCompare } from "lucide-react";
import type { DiffOutput, DiffSegment } from "@/lib/services";

interface DiffFormProps {
	initialText1: string;
	initialText2: string;
	initialResult: DiffOutput | null;
}

export function DiffForm({ initialText1, initialText2, initialResult }: DiffFormProps) {
	const [text1, setText1] = useState(initialText1);
	const [text2, setText2] = useState(initialText2);
	const [result, setResult] = useState<DiffOutput | null>(initialResult);
	const [isPending, startTransition] = useTransition();

	const compare = async () => {
		startTransition(async () => {
			try {
				const res = await fetch("/api/diff/compare", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ text1, text2 }),
				});

				const data = await res.json() as { success: boolean; data?: DiffOutput };

				if (data.success && data.data) {
					setResult(data.data);
				}
			} catch {
				// Silent fail
			}
		});
	};

	const clear = () => {
		setText1("");
		setText2("");
		setResult(null);
	};

	return (
		<form method="GET" action="/diff" onSubmit={(e) => { e.preventDefault(); compare(); }}>
			<div className="space-y-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Textarea
						label="Original"
						name="text1"
						value={text1}
						onChange={(e) => setText1(e.target.value)}
						placeholder="Enter original text..."
						className="min-h-[250px]"
					/>

					<Textarea
						label="Modified"
						name="text2"
						value={text2}
						onChange={(e) => setText2(e.target.value)}
						placeholder="Enter modified text..."
						className="min-h-[250px]"
					/>
				</div>

				<div className="flex gap-4">
					<Button type="submit" disabled={(!text1 && !text2) || isPending}>
						<GitCompare className="w-4 h-4 mr-2" />
						{isPending ? "Comparing..." : "Compare"}
					</Button>

					{(text1 || text2) && (
						<Button type="button" variant="secondary" onClick={clear}>
							Clear
						</Button>
					)}
				</div>

				{result && result.segments.length > 0 && (
					<div className="space-y-4">
						{/* Stats */}
						<div className="flex gap-4 text-sm">
							<span className="text-success">+{result.stats.additions} added</span>
							<span className="text-error">-{result.stats.deletions} removed</span>
						</div>

						{/* Diff Result */}
						<Card hover={false}>
							<h3 className="font-mono text-sm font-medium text-foreground-muted uppercase tracking-wider mb-3">
								Diff Result
							</h3>
							<div className="bg-background-secondary rounded-lg p-4 font-mono text-sm whitespace-pre-wrap break-all leading-relaxed">
								{result.segments.map((segment: DiffSegment, i: number) => {
									if (segment.type === "equal") {
										return <span key={i}>{segment.value}</span>;
									} else if (segment.type === "delete") {
										return (
											<span
												key={i}
												className="bg-error/20 text-error line-through decoration-error/50"
											>
												{segment.value}
											</span>
										);
									} else {
										return (
											<span key={i} className="bg-success/20 text-success">
												{segment.value}
											</span>
										);
									}
								})}
							</div>
						</Card>
					</div>
				)}

				{!result && !text1 && !text2 && (
					<div className="text-center py-16 text-foreground-muted">
						Enter text in both fields and click Compare
					</div>
				)}
			</div>
		</form>
	);
}
