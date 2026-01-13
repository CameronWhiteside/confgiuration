"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

interface EnvFormProps {
	initialMode: "env-to-json" | "json-to-env";
	initialInput: string;
	initialOutput: string | null;
	initialError: string | null;
}

export function EnvForm({ initialMode, initialInput, initialOutput, initialError }: EnvFormProps) {
	const [mode, setMode] = useState(initialMode);
	const [envInput, setEnvInput] = useState(initialMode === "env-to-json" ? initialInput : "");
	const [jsonInput, setJsonInput] = useState(initialMode === "json-to-env" ? initialInput : "");
	const [output, setOutput] = useState(initialOutput || "");
	const [error, setError] = useState(initialError || "");
	const [isPending, startTransition] = useTransition();

	const convert = async () => {
		startTransition(async () => {
			try {
				const endpoint = mode === "env-to-json" ? "/api/env/to-json" : "/api/env/from-json";
				const body = mode === "env-to-json"
					? { env: envInput }
					: { json: jsonInput };

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
					setError(data.error || "Conversion failed");
					setOutput("");
				}
			} catch {
				setError("Request failed");
				setOutput("");
			}
		});
	};

	return (
		<Tabs value={mode} onValueChange={(v) => { setMode(v as typeof mode); setOutput(""); setError(""); }}>
			<TabsList className="mb-6">
				<TabsTrigger value="env-to-json">ENV to JSON</TabsTrigger>
				<TabsTrigger value="json-to-env">JSON to ENV</TabsTrigger>
			</TabsList>

			<TabsContent value="env-to-json">
				<form method="GET" action="/env" onSubmit={(e) => { e.preventDefault(); convert(); }}>
					<input type="hidden" name="mode" value="env-to-json" />
					<div className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Textarea
								label="ENV Input"
								name="input"
								value={envInput}
								onChange={(e) => setEnvInput(e.target.value)}
								placeholder="DATABASE_URL=postgres://...&#10;API_KEY=secret123&#10;DEBUG=true"
								className="min-h-[300px]"
							/>

							<div>
								<div className="flex items-center justify-between mb-2">
									<label className="block text-sm font-medium text-foreground-muted">JSON Output</label>
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

						<Button type="submit" disabled={!envInput || isPending}>
							{isPending ? "Converting..." : "Convert to JSON"}
						</Button>
					</div>
				</form>
			</TabsContent>

			<TabsContent value="json-to-env">
				<form method="GET" action="/env" onSubmit={(e) => { e.preventDefault(); convert(); }}>
					<input type="hidden" name="mode" value="json-to-env" />
					<div className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Textarea
								label="JSON Input"
								name="input"
								value={jsonInput}
								onChange={(e) => setJsonInput(e.target.value)}
								placeholder='{"DATABASE_URL": "postgres://...", "API_KEY": "secret123"}'
								className="min-h-[300px]"
							/>

							<div>
								<div className="flex items-center justify-between mb-2">
									<label className="block text-sm font-medium text-foreground-muted">ENV Output</label>
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

						<Button type="submit" disabled={!jsonInput || isPending}>
							{isPending ? "Converting..." : "Convert to ENV"}
						</Button>
					</div>
				</form>
			</TabsContent>
		</Tabs>
	);
}
