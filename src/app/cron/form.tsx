"use client";

import { useState, useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import type { CronOutput } from "@/lib/services";

interface CronFormProps {
	initialExpression: string;
	initialResult: CronOutput | null;
}

const EXAMPLES = [
	{ cron: "0 * * * *", description: "Every hour" },
	{ cron: "0 0 * * *", description: "Every day at midnight" },
	{ cron: "0 9 * * 1-5", description: "Every weekday at 9am" },
	{ cron: "*/15 * * * *", description: "Every 15 minutes" },
	{ cron: "0 0 1 * *", description: "First day of every month" },
];

export function CronForm({ initialExpression, initialResult }: CronFormProps) {
	const [expression, setExpression] = useState(initialExpression);
	const [result, setResult] = useState<CronOutput | null>(initialResult);
	const [isPending, startTransition] = useTransition();

	// Auto-parse on expression change
	useEffect(() => {
		if (!expression.trim()) {
			setResult(null);
			return;
		}

		const timeout = setTimeout(() => {
			startTransition(async () => {
				try {
					const res = await fetch("/api/cron/parse", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ expression }),
					});

					const data = await res.json() as { success: boolean; data?: CronOutput };

					if (data.success && data.data) {
						setResult(data.data);
					} else {
						setResult({ isValid: false, description: "", nextRuns: [] });
					}
				} catch {
					setResult({ isValid: false, description: "", nextRuns: [] });
				}
			});
		}, 300);

		return () => clearTimeout(timeout);
	}, [expression]);

	return (
		<form method="GET" action="/cron" onSubmit={(e) => e.preventDefault()}>
			<div className="space-y-6">
				{/* Input */}
				<div>
					<Input
						label="Cron Expression"
						name="expression"
						value={expression}
						onChange={(e) => setExpression(e.target.value)}
						placeholder="* * * * *"
						className="font-mono text-lg"
					/>
					<p className="mt-2 text-sm text-foreground-muted">
						Format: minute hour day-of-month month day-of-week
					</p>
				</div>

				{/* Status */}
				{expression.trim() && result && (
					<>
						{result.isValid ? (
							<Card hover={false} className="bg-success-bg border-success/20">
								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-success mt-0.5" />
									<div>
										<p className="font-medium text-foreground">Valid Expression</p>
										<p className="text-foreground-muted mt-1 capitalize">{result.description}</p>
									</div>
								</div>
							</Card>
						) : (
							<Card hover={false} className="bg-error-bg border-error/20">
								<div className="flex items-center gap-3 text-error">
									<AlertCircle className="w-5 h-5" />
									<span>Invalid cron expression - must have exactly 5 fields</span>
								</div>
							</Card>
						)}
					</>
				)}

				{/* Parts Breakdown */}
				{result?.isValid && result.parts && (
					<Card hover={false}>
						<h3 className="font-mono text-sm font-medium text-foreground-muted uppercase tracking-wider mb-4">
							Expression Breakdown
						</h3>
						<div className="grid grid-cols-5 gap-4 text-center">
							{[
								{ label: "Minute", value: result.parts.minute, range: "0-59" },
								{ label: "Hour", value: result.parts.hour, range: "0-23" },
								{ label: "Day", value: result.parts.dayOfMonth, range: "1-31" },
								{ label: "Month", value: result.parts.month, range: "1-12" },
								{ label: "Weekday", value: result.parts.dayOfWeek, range: "0-6" },
							].map((part) => (
								<div key={part.label}>
									<div className="bg-background-secondary rounded-lg p-3 font-mono text-lg mb-2">
										{part.value}
									</div>
									<div className="text-sm font-medium text-foreground">{part.label}</div>
									<div className="text-xs text-foreground-muted">{part.range}</div>
								</div>
							))}
						</div>
					</Card>
				)}

				{/* Examples */}
				<Card hover={false}>
					<h3 className="font-mono text-sm font-medium text-foreground-muted uppercase tracking-wider mb-4">
						Common Examples
					</h3>
					<div className="space-y-2">
						{EXAMPLES.map((example) => (
							<button
								key={example.cron}
								type="button"
								onClick={() => setExpression(example.cron)}
								className="w-full flex items-center justify-between p-3 rounded-lg bg-background-secondary/50 hover:bg-background-secondary transition-colors text-left"
							>
								<code className="font-mono text-sm text-foreground">{example.cron}</code>
								<span className="text-sm text-foreground-muted">{example.description}</span>
							</button>
						))}
					</div>
				</Card>

				{/* Reference */}
				<Card hover={false} className="bg-background-secondary/50 border-dashed">
					<h3 className="font-medium text-foreground mb-3">Quick Reference</h3>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<code className="text-primary">*</code>
							<span className="text-foreground-muted ml-2">any value</span>
						</div>
						<div>
							<code className="text-primary">,</code>
							<span className="text-foreground-muted ml-2">value list (1,2,3)</span>
						</div>
						<div>
							<code className="text-primary">-</code>
							<span className="text-foreground-muted ml-2">range (1-5)</span>
						</div>
						<div>
							<code className="text-primary">/</code>
							<span className="text-foreground-muted ml-2">step (*/15)</span>
						</div>
					</div>
				</Card>
			</div>
		</form>
	);
}
