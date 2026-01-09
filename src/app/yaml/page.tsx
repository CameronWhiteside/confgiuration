"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import YAML from "yaml";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

export default function YamlPage() {
	const [yamlInput, setYamlInput] = useState("");
	const [jsonInput, setJsonInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [mode, setMode] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");

	const convertYamlToJson = () => {
		setError("");
		try {
			const parsed = YAML.parse(yamlInput);
			setOutput(JSON.stringify(parsed, null, 2));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Invalid YAML");
			setOutput("");
		}
	};

	const convertJsonToYaml = () => {
		setError("");
		try {
			const parsed = JSON.parse(jsonInput);
			setOutput(YAML.stringify(parsed, { indent: 2 }));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Invalid JSON");
			setOutput("");
		}
	};

	const handleConvert = () => {
		if (mode === "yaml-to-json") {
			convertYamlToJson();
		} else {
			convertJsonToYaml();
		}
	};

	return (
		<ToolLayout toolId="yaml">
			<Tabs
				defaultValue="yaml-to-json"
				onValueChange={(v) => {
					setMode(v as "yaml-to-json" | "json-to-yaml");
					setError("");
					setOutput("");
				}}
			>
				<TabsList className="mb-6">
					<TabsTrigger value="yaml-to-json">YAML to JSON</TabsTrigger>
					<TabsTrigger value="json-to-yaml">JSON to YAML</TabsTrigger>
				</TabsList>

				<TabsContent value="yaml-to-json">
					<div className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Textarea
								label="YAML Input"
								value={yamlInput}
								onChange={(e) => setYamlInput(e.target.value)}
								placeholder="name: John&#10;age: 30&#10;items:&#10;  - one&#10;  - two"
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

						<AnimatePresence>
							{error && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
								>
									<Card hover={false} className="bg-error-bg border-error/20 p-4">
										<div className="flex items-center gap-3 text-error">
											<AlertCircle className="w-5 h-5 flex-shrink-0" />
											<code className="text-sm">{error}</code>
										</div>
									</Card>
								</motion.div>
							)}
						</AnimatePresence>

						<Button onClick={handleConvert} disabled={!yamlInput}>
							Convert to JSON
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="json-to-yaml">
					<div className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Textarea
								label="JSON Input"
								value={jsonInput}
								onChange={(e) => setJsonInput(e.target.value)}
								placeholder='{"name": "John", "age": 30}'
								className="min-h-[300px]"
							/>

							<div>
								<div className="flex items-center justify-between mb-2">
									<label className="block text-sm font-medium text-foreground-muted">
										YAML Output
									</label>
									{output && <CopyButton text={output} variant="ghost" />}
								</div>
								<textarea
									value={output}
									readOnly
									placeholder="YAML will appear here..."
									className="w-full min-h-[300px] bg-card border border-border rounded-lg px-3 py-3 text-sm font-mono text-foreground placeholder:text-foreground-muted/60 focus:outline-none"
								/>
							</div>
						</div>

						<AnimatePresence>
							{error && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
								>
									<Card hover={false} className="bg-error-bg border-error/20 p-4">
										<div className="flex items-center gap-3 text-error">
											<AlertCircle className="w-5 h-5 flex-shrink-0" />
											<code className="text-sm">{error}</code>
										</div>
									</Card>
								</motion.div>
							)}
						</AnimatePresence>

						<Button onClick={handleConvert} disabled={!jsonInput}>
							Convert to YAML
						</Button>
					</div>
				</TabsContent>
			</Tabs>
		</ToolLayout>
	);
}
