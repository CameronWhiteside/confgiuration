"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import type { LoremType } from "@/lib/services";

interface LoremFormProps {
	initialType: LoremType;
	initialCount: number;
	initialResult: string | null;
}

export function LoremForm({ initialType, initialCount, initialResult }: LoremFormProps) {
	const [type, setType] = useState<LoremType>(initialType);
	const [count, setCount] = useState(initialCount);
	const [result, setResult] = useState(initialResult || "");
	const [isPending, startTransition] = useTransition();

	const generate = async () => {
		startTransition(async () => {
			try {
				const res = await fetch(`/api/lorem/generate?type=${type}&count=${count}`);
				const data = await res.json() as { success: boolean; data?: { result: string } };

				if (data.success && data.data) {
					setResult(data.data.result);
				}
			} catch {
				// Silent fail
			}
		});
	};

	return (
		<form method="GET" action="/lorem" onSubmit={(e) => { e.preventDefault(); generate(); }}>
			<div className="space-y-6">
				{/* Controls */}
				<Card hover={false} className="p-4">
					<div className="flex flex-wrap items-end gap-4">
						<div className="w-24">
							<Input
								label="Count"
								name="count"
								type="number"
								min={1}
								max={100}
								value={count}
								onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
							/>
						</div>

						<div className="w-40">
							<Select
								label="Unit"
								name="type"
								value={type}
								onChange={(e) => setType(e.target.value as LoremType)}
							>
								<option value="paragraphs">Paragraphs</option>
								<option value="sentences">Sentences</option>
								<option value="words">Words</option>
							</Select>
						</div>

						<Button type="submit" disabled={isPending} className="flex items-center gap-2">
							<RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
							{isPending ? "Generating..." : "Generate"}
						</Button>
					</div>
				</Card>

				{/* Output */}
				{result ? (
					<Card hover={false}>
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm font-medium text-foreground-muted">
								Generated Text
							</span>
							<CopyButton text={result} />
						</div>
						<div className="prose prose-sm max-w-none">
							<div className="whitespace-pre-wrap text-foreground leading-relaxed">
								{result}
							</div>
						</div>
					</Card>
				) : (
					<div className="text-center py-16 text-foreground-muted">
						Click Generate to create placeholder text
					</div>
				)}
			</div>
		</form>
	);
}
