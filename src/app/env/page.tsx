"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

function parseEnv(env: string): Record<string, string> {
	const result: Record<string, string> = {};
	const lines = env.split("\n");

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;

		const eqIndex = trimmed.indexOf("=");
		if (eqIndex === -1) continue;

		const key = trimmed.slice(0, eqIndex).trim();
		let value = trimmed.slice(eqIndex + 1).trim();

		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		result[key] = value;
	}

	return result;
}

function jsonToEnv(json: Record<string, unknown>): string {
	const lines: string[] = [];

	for (const [key, value] of Object.entries(json)) {
		const strValue = String(value);
		const needsQuotes =
			strValue.includes(" ") || strValue.includes("=") || strValue.includes("#");
		lines.push(`${key}=${needsQuotes ? `"${strValue}"` : strValue}`);
	}

	return lines.join("\n");
}

export default function EnvPage() {
	const [envInput, setEnvInput] = useState("");
	const [jsonInput, setJsonInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [mode, setMode] = useState<"env-to-json" | "json-to-env">("env-to-json");

	const convertEnvToJson = () => {
		setError("");
		try {
			const parsed = parseEnv(envInput);
			setOutput(JSON.stringify(parsed, null, 2));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Invalid ENV format");
			setOutput("");
		}
	};

	const convertJsonToEnv = () => {
		setError("");
		try {
			const parsed = JSON.parse(jsonInput);
			setOutput(jsonToEnv(parsed));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Invalid JSON");
			setOutput("");
		}
	};

	const handleConvert = () => {
		if (mode === "env-to-json") {
			convertEnvToJson();
		} else {
			convertJsonToEnv();
		}
	};

	return (
		<ToolLayout toolId="env">
			<Tabs
				defaultValue="env-to-json"
				onValueChange={(v) => {
					setMode(v as "env-to-json" | "json-to-env");
					setError("");
					setOutput("");
				}}
			>
				<TabsList className="mb-6">
					<TabsTrigger value="env-to-json">ENV to JSON</TabsTrigger>
					<TabsTrigger value="json-to-env">JSON to ENV</TabsTrigger>
				</TabsList>

				<TabsContent value="env-to-json">
					<div className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Textarea
								label="ENV Input"
								value={envInput}
								onChange={(e) => setEnvInput(e.target.value)}
								placeholder="DATABASE_URL=postgres://...&#10;API_KEY=secret123&#10;DEBUG=true"
								className="min-h-[300px]"
							/>

							<div>
								<div className="flex items-center justify-between mb-2">
									<label className="block text-sm font-medium text-foreground-muted">
										JSON Output
									</label>
									{output && <CopyButton text={output} variant="ghost" />}
								</div>
								<textarea
									value={output}
									readOnly
									placeholder="JSON will appear here..."
									className="w-full min-h-[300px] bg-card border border-border rounded-lg px-3 py-3 text-sm font-mono text-foreground placeholder:text-foreground-muted/60 focus:outline-none"
								/>
							</div>
						</div>

						{error && (
						<Card hover={false} className="bg-error-bg border-error/20 p-4">
							<div className="flex items-center gap-3 text-error">
								<AlertCircle className="w-5 h-5 flex-shrink-0" />
								<code className="text-sm">{error}</code>
							</div>
						</Card>
					)}

						<Button onClick={handleConvert} disabled={!envInput}>
							Convert to JSON
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="json-to-env">
					<div className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Textarea
								label="JSON Input"
								value={jsonInput}
								onChange={(e) => setJsonInput(e.target.value)}
								placeholder='{"DATABASE_URL": "postgres://...", "API_KEY": "secret123"}'
								className="min-h-[300px]"
							/>

							<div>
								<div className="flex items-center justify-between mb-2">
									<label className="block text-sm font-medium text-foreground-muted">
										ENV Output
									</label>
									{output && <CopyButton text={output} variant="ghost" />}
								</div>
								<textarea
									value={output}
									readOnly
									placeholder="ENV will appear here..."
									className="w-full min-h-[300px] bg-card border border-border rounded-lg px-3 py-3 text-sm font-mono text-foreground placeholder:text-foreground-muted/60 focus:outline-none"
								/>
							</div>
						</div>

						{error && (
						<Card hover={false} className="bg-error-bg border-error/20 p-4">
							<div className="flex items-center gap-3 text-error">
								<AlertCircle className="w-5 h-5 flex-shrink-0" />
								<code className="text-sm">{error}</code>
							</div>
						</Card>
					)}

						<Button onClick={handleConvert} disabled={!jsonInput}>
							Convert to ENV
						</Button>
					</div>
				</TabsContent>
			</Tabs>
		</ToolLayout>
	);
}
