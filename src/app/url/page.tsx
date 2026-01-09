"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

export default function UrlPage() {
	const [encodeInput, setEncodeInput] = useState("");
	const [decodeInput, setDecodeInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");
	const [componentMode, setComponentMode] = useState(true);

	const encode = () => {
		setError("");
		try {
			setOutput(componentMode ? encodeURIComponent(encodeInput) : encodeURI(encodeInput));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Encoding failed");
			setOutput("");
		}
	};

	const decode = () => {
		setError("");
		try {
			setOutput(componentMode ? decodeURIComponent(decodeInput) : decodeURI(decodeInput));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Decoding failed");
			setOutput("");
		}
	};

	const handleAction = () => {
		if (mode === "encode") {
			encode();
		} else {
			decode();
		}
	};

	return (
		<ToolLayout toolId="url">
			<Tabs
				defaultValue="encode"
				onValueChange={(v) => {
					setMode(v as "encode" | "decode");
					setError("");
					setOutput("");
				}}
			>
				<div className="flex flex-wrap items-center gap-4 mb-6">
					<TabsList>
						<TabsTrigger value="encode">Encode</TabsTrigger>
						<TabsTrigger value="decode">Decode</TabsTrigger>
					</TabsList>

					<label className="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							checked={componentMode}
							onChange={(e) => setComponentMode(e.target.checked)}
							className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
						/>
						<span className="text-foreground-muted">Component mode (encode all special chars)</span>
					</label>
				</div>

				<TabsContent value="encode">
					<div className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Textarea
								label="Text Input"
								value={encodeInput}
								onChange={(e) => setEncodeInput(e.target.value)}
								placeholder="hello world & foo=bar"
								className="min-h-[200px]"
							/>

							<div>
								<div className="flex items-center justify-between mb-2">
									<label className="block text-sm font-medium text-foreground-muted">
										URL Encoded Output
									</label>
									{output && <CopyButton text={output} variant="ghost" />}
								</div>
								<textarea
									value={output}
									readOnly
									placeholder="Encoded result will appear here..."
									className="w-full min-h-[200px] bg-card border border-border rounded-lg px-3 py-3 text-sm font-mono text-foreground placeholder:text-foreground-muted/60 focus:outline-none break-all"
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

						<Button onClick={handleAction} disabled={!encodeInput}>
							Encode
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="decode">
					<div className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Textarea
								label="URL Encoded Input"
								value={decodeInput}
								onChange={(e) => setDecodeInput(e.target.value)}
								placeholder="hello%20world%20%26%20foo%3Dbar"
								className="min-h-[200px]"
							/>

							<div>
								<div className="flex items-center justify-between mb-2">
									<label className="block text-sm font-medium text-foreground-muted">
										Decoded Output
									</label>
									{output && <CopyButton text={output} variant="ghost" />}
								</div>
								<textarea
									value={output}
									readOnly
									placeholder="Decoded result will appear here..."
									className="w-full min-h-[200px] bg-card border border-border rounded-lg px-3 py-3 text-sm font-mono text-foreground placeholder:text-foreground-muted/60 focus:outline-none"
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

						<Button onClick={handleAction} disabled={!decodeInput}>
							Decode
						</Button>
					</div>
				</TabsContent>
			</Tabs>
		</ToolLayout>
	);
}
