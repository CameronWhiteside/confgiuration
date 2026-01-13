"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import type { SqlDialect } from "@/lib/services";

interface SqlFormProps {
	initialInput: string;
	initialOutput: string | null;
	initialError: string | null;
	initialDialect: SqlDialect;
	initialIndent: number;
	initialUppercase: boolean;
}

const DIALECTS: { value: SqlDialect; label: string }[] = [
	{ value: "sql", label: "Standard SQL" },
	{ value: "mysql", label: "MySQL" },
	{ value: "postgresql", label: "PostgreSQL" },
	{ value: "sqlite", label: "SQLite" },
	{ value: "bigquery", label: "BigQuery" },
	{ value: "redshift", label: "Redshift" },
];

export function SqlForm({
	initialInput,
	initialOutput,
	initialError,
	initialDialect,
	initialIndent,
	initialUppercase,
}: SqlFormProps) {
	const [input, setInput] = useState(initialInput);
	const [output, setOutput] = useState(initialOutput || "");
	const [error, setError] = useState(initialError || "");
	const [dialect, setDialect] = useState<SqlDialect>(initialDialect);
	const [indent, setIndent] = useState(initialIndent);
	const [uppercase, setUppercase] = useState(initialUppercase);
	const [isPending, startTransition] = useTransition();

	const handleFormat = async (minify: boolean = false) => {
		startTransition(async () => {
			try {
				const endpoint = minify ? "/api/sql/minify" : "/api/sql/format";
				const body = minify
					? { sql: input }
					: { sql: input, dialect, indent, uppercase };

				const res = await fetch(endpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				});

				const data = await res.json() as { success: boolean; data?: { result: string }; error?: string };

				if (data.success && data.data) {
					setOutput(data.data.result);
					setError("");
				} else {
					setError(data.error || "Format failed");
					setOutput("");
				}
			} catch {
				setError("Request failed");
				setOutput("");
			}
		});
	};

	return (
		<form method="GET" action="/sql" onSubmit={(e) => { e.preventDefault(); handleFormat(); }}>
			<div className="space-y-6">
				{/* Options */}
				<Card hover={false} className="p-4">
					<div className="flex flex-wrap items-end gap-4">
						<div className="w-40">
							<Select
								label="Dialect"
								name="dialect"
								value={dialect}
								onChange={(e) => setDialect(e.target.value as SqlDialect)}
							>
								{DIALECTS.map((d) => (
									<option key={d.value} value={d.value}>{d.label}</option>
								))}
							</Select>
						</div>

						<div className="w-24">
							<Select
								label="Indent"
								name="indent"
								value={indent}
								onChange={(e) => setIndent(Number(e.target.value))}
							>
								<option value={2}>2 spaces</option>
								<option value={4}>4 spaces</option>
							</Select>
						</div>

						<label className="flex items-center gap-2 pb-2">
							<input
								type="checkbox"
								name="uppercase"
								checked={uppercase}
								onChange={(e) => setUppercase(e.target.checked)}
								className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
							/>
							<span className="text-sm text-foreground-muted">Uppercase keywords</span>
						</label>

						<div className="flex gap-2 ml-auto">
							<Button type="submit" disabled={!input.trim() || isPending}>
								{isPending ? "Formatting..." : "Format"}
							</Button>
							<Button type="button" variant="secondary" onClick={() => handleFormat(true)} disabled={!input.trim() || isPending}>
								Minify
							</Button>
						</div>
					</div>
				</Card>

				{/* Input/Output Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Textarea
						label="Input SQL"
						name="input"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Paste your SQL query here..."
						className="min-h-[400px] font-mono text-sm"
					/>

					<div>
						<div className="flex items-center justify-between mb-2">
							<label className="block text-sm font-medium text-foreground-muted">Formatted Output</label>
							{output && <CopyButton text={output} variant="ghost" />}
						</div>
						<textarea
							value={output}
							readOnly
							placeholder="Formatted SQL will appear here..."
							className="w-full min-h-[400px] bg-card border border-border rounded-lg px-3 py-3 text-sm font-mono text-foreground placeholder:text-foreground-muted/60 focus:outline-none"
						/>
					</div>
				</div>

				{/* Error Display */}
				{error && (
					<Card hover={false} className="bg-error-bg border-error/20 p-4">
						<div className="flex items-center gap-3 text-error">
							<AlertCircle className="w-5 h-5 flex-shrink-0" />
							<code className="text-sm">{error}</code>
						</div>
					</Card>
				)}
			</div>
		</form>
	);
}
