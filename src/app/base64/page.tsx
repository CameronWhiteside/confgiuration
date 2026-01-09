"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

export default function Base64Page() {
	const [textInput, setTextInput] = useState("");
	const [base64Input, setBase64Input] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");

	const encode = () => {
		setError("");
		try {
			const bytes = new TextEncoder().encode(textInput);
			const binary = Array.from(bytes)
				.map((b) => String.fromCharCode(b))
				.join("");
			setOutput(btoa(binary));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Encoding failed");
			setOutput("");
		}
	};

	const decode = () => {
		setError("");
		try {
			const binary = atob(base64Input);
			const bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) {
				bytes[i] = binary.charCodeAt(i);
			}
			setOutput(new TextDecoder().decode(bytes));
		} catch {
			setError("Invalid Base64 string");
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
		<ToolLayout toolId="base64">
			<Tabs
				defaultValue="encode"
				onValueChange={(v) => {
					setMode(v as "encode" | "decode");
					setError("");
					setOutput("");
				}}
			>
				<TabsList className="mb-6">
					<TabsTrigger value="encode">Encode</TabsTrigger>
					<TabsTrigger value="decode">Decode</TabsTrigger>
				</TabsList>

				<TabsContent value="encode">
					<div className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Textarea
								label="Text Input"
								value={textInput}
								onChange={(e) => setTextInput(e.target.value)}
								placeholder="Enter text to encode..."
								className="min-h-[200px]"
							/>

							<div>
								<div className="flex items-center justify-between mb-2">
									<label className="block text-sm font-medium text-foreground-muted">
										Base64 Output
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

						{error && (
							<Card hover={false} className="bg-error-bg border-error/20 p-4">
								<div className="flex items-center gap-3 text-error">
									<AlertCircle className="w-5 h-5 flex-shrink-0" />
									<code className="text-sm">{error}</code>
								</div>
							</Card>
						)}

						<Button onClick={handleAction} disabled={!textInput}>
							Encode
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="decode">
					<div className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Textarea
								label="Base64 Input"
								value={base64Input}
								onChange={(e) => setBase64Input(e.target.value)}
								placeholder="Enter Base64 to decode..."
								className="min-h-[200px]"
							/>

							<div>
								<div className="flex items-center justify-between mb-2">
									<label className="block text-sm font-medium text-foreground-muted">
										Text Output
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

						{error && (
							<Card hover={false} className="bg-error-bg border-error/20 p-4">
								<div className="flex items-center gap-3 text-error">
									<AlertCircle className="w-5 h-5 flex-shrink-0" />
									<code className="text-sm">{error}</code>
								</div>
							</Card>
						)}

						<Button onClick={handleAction} disabled={!base64Input}>
							Decode
						</Button>
					</div>
				</TabsContent>
			</Tabs>
		</ToolLayout>
	);
}
