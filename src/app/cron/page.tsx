"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

interface CronParts {
	minute: string;
	hour: string;
	dayOfMonth: string;
	month: string;
	dayOfWeek: string;
}

function parseCronExpression(cron: string): CronParts | null {
	const parts = cron.trim().split(/\s+/);
	if (parts.length !== 5) return null;

	return {
		minute: parts[0],
		hour: parts[1],
		dayOfMonth: parts[2],
		month: parts[3],
		dayOfWeek: parts[4],
	};
}

function explainPart(value: string, unit: string, names?: string[]): string {
	if (value === "*") return `every ${unit}`;
	if (value.includes("/")) {
		const [, step] = value.split("/");
		return `every ${step} ${unit}s`;
	}
	if (value.includes("-")) {
		const [start, end] = value.split("-");
		const startName = names ? names[parseInt(start)] || start : start;
		const endName = names ? names[parseInt(end)] || end : end;
		return `${startName} through ${endName}`;
	}
	if (value.includes(",")) {
		const vals = value.split(",");
		const namedVals = names ? vals.map((v) => names[parseInt(v)] || v) : vals;
		return namedVals.join(", ");
	}
	return names ? names[parseInt(value)] || value : value;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function explainCron(cron: string): string {
	const parts = parseCronExpression(cron);
	if (!parts) return "Invalid cron expression";

	const explanations: string[] = [];

	// Minute
	if (parts.minute === "*") {
		explanations.push("every minute");
	} else if (parts.minute === "0") {
		explanations.push("at minute 0");
	} else {
		explanations.push(`at minute ${explainPart(parts.minute, "minute")}`);
	}

	// Hour
	if (parts.hour !== "*") {
		explanations.push(`past hour ${explainPart(parts.hour, "hour")}`);
	}

	// Day of Month
	if (parts.dayOfMonth !== "*") {
		explanations.push(`on day ${explainPart(parts.dayOfMonth, "day")} of the month`);
	}

	// Month
	if (parts.month !== "*") {
		explanations.push(`in ${explainPart(parts.month, "month", MONTHS)}`);
	}

	// Day of Week
	if (parts.dayOfWeek !== "*") {
		explanations.push(`on ${explainPart(parts.dayOfWeek, "day", DAYS)}`);
	}

	return explanations.join(" ");
}



const EXAMPLES = [
	{ cron: "0 * * * *", description: "Every hour" },
	{ cron: "0 0 * * *", description: "Every day at midnight" },
	{ cron: "0 9 * * 1-5", description: "Every weekday at 9am" },
	{ cron: "*/15 * * * *", description: "Every 15 minutes" },
	{ cron: "0 0 1 * *", description: "First day of every month" },
];

export default function CronPage() {
	const [input, setInput] = useState("0 9 * * 1-5");

	const parts = useMemo(() => parseCronExpression(input), [input]);
	const explanation = useMemo(() => explainCron(input), [input]);
	const isValid = parts !== null;

	return (
		<ToolLayout toolId="cron">
			<div className="space-y-6">
				{/* Input */}
				<div>
					<Input
						label="Cron Expression"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="* * * * *"
						className="font-mono text-lg"
					/>
					<p className="mt-2 text-sm text-foreground-muted">
						Format: minute hour day-of-month month day-of-week
					</p>
				</div>

				{/* Status */}
				{input.trim() && (
					<>
						{isValid ? (
							<Card hover={false} className="bg-success-bg border-success/20">
								<div className="flex items-start gap-3">
									<CheckCircle className="w-5 h-5 text-success mt-0.5" />
									<div>
										<p className="font-medium text-foreground">Valid Expression</p>
										<p className="text-foreground-muted mt-1 capitalize">{explanation}</p>
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
				{isValid && parts && (
					<Card hover={false}>
						<h3 className="font-mono text-sm font-medium text-foreground-muted uppercase tracking-wider mb-4">
							Expression Breakdown
						</h3>
						<div className="grid grid-cols-5 gap-4 text-center">
							{[
								{ label: "Minute", value: parts.minute, range: "0-59" },
								{ label: "Hour", value: parts.hour, range: "0-23" },
								{ label: "Day", value: parts.dayOfMonth, range: "1-31" },
								{ label: "Month", value: parts.month, range: "1-12" },
								{ label: "Weekday", value: parts.dayOfWeek, range: "0-6" },
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
								onClick={() => setInput(example.cron)}
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
		</ToolLayout>
	);
}
