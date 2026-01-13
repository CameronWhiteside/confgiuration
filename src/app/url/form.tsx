"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

interface UrlFormProps {
	initialMode: "encode" | "decode";
	initialInput: string;
	initialOutput: string | null;
	initialError: string | null;
	initialEncodeComponent: boolean;
}

export function UrlForm({
	initialMode,
	initialInput,
	initialOutput,
	initialError,
	initialEncodeComponent,
}: UrlFormProps) {
	const [mode, setMode] = useState(initialMode);
	const [encodeInput, setEncodeInput] = useState(initialMode === "encode" ? initialInput : "");
	const [decodeInput, setDecodeInput] = useState(initialMode === "decode" ? initialInput : "");
	const [output, setOutput] = useState(initialOutput || "");
	const [error, setError] = useState(initialError || "");
	const [encodeComponent, setEncodeComponent] = useState(initialEncodeComponent);
	const [isPending, startTransition] = useTransition();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		startTransition(async () => {
			try {
				const endpoint = mode === "encode" ? "/api/url/encode" : "/api/url/decode";
				const body =
					mode === "encode"
						? { text: encodeInput, encodeComponent }
						: { url: decodeInput, decodeComponent: encodeComponent };

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
					setError(data.error || "Encoding failed");
					setOutput("");
				}
			} catch {
				setError("Request failed");
				setOutput("");
			}
		});
	};

	const handleModeChange = (newMode: string) => {
		setMode(newMode as "encode" | "decode");
		setOutput("");
		setError("");
	};

	return (
		<Tabs value={mode} onValueChange={handleModeChange}>
			<TabsList className="mb-6">
				<TabsTrigger value="encode">Encode</TabsTrigger>
				<TabsTrigger value="decode">Decode</TabsTrigger>
			</TabsList>

			<TabsContent value="encode">
				<form onSubmit={handleSubmit} method="GET" action="/url">
					<input type="hidden" name="mode" value="encode" />
					<input type="hidden" name="component" value={encodeComponent.toString()} />

					<div className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Textarea
								label="Text Input"
								name="input"
								value={encodeInput}
								onChange={(e) => setEncodeInput(e.target.value)}
								placeholder="Enter text to URL encode..."
								className="min-h-[200px]"
							/>

							<div>
								<div className="flex items-center justify-between mb-2">
									<label className="block text-sm font-medium text-foreground-muted">
										Encoded Output
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

						<div className="flex items-center gap-4">
							<Button type="submit" disabled={!encodeInput || isPending}>
								{isPending ? "Encoding..." : "Encode"}
							</Button>
							<label className="flex items-center gap-2 text-sm text-foreground-muted cursor-pointer">
								<input
									type="checkbox"
									checked={encodeComponent}
									onChange={(e) => setEncodeComponent(e.target.checked)}
									className="rounded border-border"
								/>
								Encode as component (encodeURIComponent)
							</label>
						</div>
					</div>
				</form>
			</TabsContent>

			<TabsContent value="decode">
				<form onSubmit={handleSubmit} method="GET" action="/url">
					<input type="hidden" name="mode" value="decode" />
					<input type="hidden" name="component" value={encodeComponent.toString()} />

					<div className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Textarea
								label="URL Input"
								name="input"
								value={decodeInput}
								onChange={(e) => setDecodeInput(e.target.value)}
								placeholder="Enter URL-encoded text to decode..."
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

						{error && (
							<Card hover={false} className="bg-error-bg border-error/20 p-4">
								<div className="flex items-center gap-3 text-error">
									<AlertCircle className="w-5 h-5 flex-shrink-0" />
									<code className="text-sm">{error}</code>
								</div>
							</Card>
						)}

						<div className="flex items-center gap-4">
							<Button type="submit" disabled={!decodeInput || isPending}>
								{isPending ? "Decoding..." : "Decode"}
							</Button>
							<label className="flex items-center gap-2 text-sm text-foreground-muted cursor-pointer">
								<input
									type="checkbox"
									checked={encodeComponent}
									onChange={(e) => setEncodeComponent(e.target.checked)}
									className="rounded border-border"
								/>
								Decode as component (decodeURIComponent)
							</label>
						</div>
					</div>
				</form>
			</TabsContent>
		</Tabs>
	);
}
