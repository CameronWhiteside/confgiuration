"use client";

import { useState } from "react";
import { format } from "sql-formatter";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

type SQLDialect = "sql" | "mysql" | "postgresql" | "sqlite" | "bigquery" | "redshift";

const DIALECTS: { value: SQLDialect; label: string }[] = [
	{ value: "sql", label: "Standard SQL" },
	{ value: "mysql", label: "MySQL" },
	{ value: "postgresql", label: "PostgreSQL" },
	{ value: "sqlite", label: "SQLite" },
	{ value: "bigquery", label: "BigQuery" },
	{ value: "redshift", label: "Redshift" },
];

const SAMPLE_SQL = `SELECT u.id, u.name, u.email, COUNT(o.id) as order_count, SUM(o.total) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at > '2024-01-01' AND u.status = 'active' GROUP BY u.id, u.name, u.email HAVING COUNT(o.id) > 0 ORDER BY total_spent DESC LIMIT 100;`;

export default function SqlPage() {
	const [input, setInput] = useState(SAMPLE_SQL);
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [dialect, setDialect] = useState<SQLDialect>("sql");
	const [tabWidth, setTabWidth] = useState(2);
	const [uppercase, setUppercase] = useState(true);

	const formatSql = () => {
		setError("");
		try {
			const formatted = format(input, {
				language: dialect,
				tabWidth,
				keywordCase: uppercase ? "upper" : "lower",
				linesBetweenQueries: 2,
			});
			setOutput(formatted);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to format SQL");
			setOutput("");
		}
	};

	const minify = () => {
		setError("");
		try {
			// Simple minification - remove extra whitespace
			const minified = input
				.replace(/\s+/g, " ")
				.replace(/\s*([,()])\s*/g, "$1")
				.trim();
			setOutput(minified);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to minify SQL");
			setOutput("");
		}
	};

	return (
		<ToolLayout toolId="sql">
			<div className="space-y-6">
				{/* Options */}
				<Card hover={false} className="p-4">
					<div className="flex flex-wrap items-end gap-4">
						<div className="w-40">
							<Select
								label="Dialect"
								value={dialect}
								onChange={(e) => setDialect(e.target.value as SQLDialect)}
							>
								{DIALECTS.map((d) => (
									<option key={d.value} value={d.value}>
										{d.label}
									</option>
								))}
							</Select>
						</div>

						<div className="w-24">
							<Select
								label="Indent"
								value={tabWidth}
								onChange={(e) => setTabWidth(Number(e.target.value))}
							>
								<option value={2}>2 spaces</option>
								<option value={4}>4 spaces</option>
							</Select>
						</div>

						<label className="flex items-center gap-2 pb-2">
							<input
								type="checkbox"
								checked={uppercase}
								onChange={(e) => setUppercase(e.target.checked)}
								className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
							/>
							<span className="text-sm text-foreground-muted">Uppercase keywords</span>
						</label>

						<div className="flex gap-2 ml-auto">
							<Button onClick={formatSql} disabled={!input.trim()}>
								Format
							</Button>
							<Button variant="secondary" onClick={minify} disabled={!input.trim()}>
								Minify
							</Button>
						</div>
					</div>
				</Card>

				{/* Input/Output Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Textarea
						label="Input SQL"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Paste your SQL query here..."
						className="min-h-[400px] font-mono text-sm"
					/>

					<div>
						<div className="flex items-center justify-between mb-2">
							<label className="block text-sm font-medium text-foreground-muted">
								Formatted Output
							</label>
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
		</ToolLayout>
	);
}
