"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Download, QrCode } from "lucide-react";

interface QrFormProps {
	initialText: string;
	initialSize: number;
	initialQrData: string | null;
	initialError: string | null;
}

export function QrForm({ initialText, initialSize, initialQrData, initialError }: QrFormProps) {
	const [text, setText] = useState(initialText);
	const [size, setSize] = useState(initialSize);
	const [qrData, setQrData] = useState(initialQrData);
	const [error, setError] = useState(initialError || "");
	const [isPending, startTransition] = useTransition();

	const generateQr = useCallback(async () => {
		if (!text.trim()) {
			setQrData(null);
			return;
		}

		startTransition(async () => {
			try {
				const res = await fetch("/api/qr/generate", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ text, size }),
				});

				const data = await res.json() as { success: boolean; data?: { data: string }; error?: string };

				if (data.success && data.data) {
					setQrData(data.data.data);
					setError("");
				} else {
					setError(data.error || "QR generation failed");
					setQrData(null);
				}
			} catch {
				setError("Request failed");
				setQrData(null);
			}
		});
	}, [text, size]);

	// Auto-generate on input change (debounced)
	useEffect(() => {
		const timeout = setTimeout(() => {
			if (text.trim()) {
				generateQr();
			} else {
				setQrData(null);
			}
		}, 300);

		return () => clearTimeout(timeout);
	}, [text, size, generateQr]);

	const downloadQr = () => {
		if (!qrData) return;

		const link = document.createElement("a");
		link.download = "qrcode.png";
		link.href = qrData;
		link.click();
	};

	return (
		<form method="GET" action="/qr" onSubmit={(e) => { e.preventDefault(); generateQr(); }}>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Input Section */}
				<div className="space-y-4">
					<Textarea
						label="Content"
						name="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="Enter text or URL to encode..."
						className="min-h-[200px]"
					/>

					<div className="flex gap-4">
						<div className="w-32">
							<Select
								label="Size"
								name="size"
								value={size}
								onChange={(e) => setSize(Number(e.target.value))}
							>
								<option value={128}>128px</option>
								<option value={256}>256px</option>
								<option value={512}>512px</option>
								<option value={1024}>1024px</option>
							</Select>
						</div>

						<div className="flex-1 flex items-end">
							<Button type="submit" disabled={!text.trim() || isPending}>
								{isPending ? "Generating..." : "Generate QR Code"}
							</Button>
						</div>
					</div>

					{error && <p className="text-sm text-error">{error}</p>}
				</div>

				{/* Preview Section */}
				<div>
					<label className="block text-sm font-medium text-foreground-muted mb-2">
						Preview
					</label>
					{qrData ? (
						<Card hover={false} className="flex flex-col items-center p-8">
							<div className="bg-white p-4 rounded-xl shadow-md">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={qrData}
									alt="QR Code"
									className="max-w-full h-auto"
									style={{ imageRendering: "pixelated" }}
								/>
							</div>

							<Button
								type="button"
								variant="secondary"
								onClick={downloadQr}
								className="mt-6 flex items-center gap-2"
							>
								<Download className="w-4 h-4" />
								Download PNG
							</Button>
						</Card>
					) : (
						<Card
							hover={false}
							className="flex flex-col items-center justify-center p-16 border-dashed bg-background-secondary/30"
						>
							<QrCode className="w-16 h-16 text-foreground-muted/30 mb-4" />
							<p className="text-foreground-muted text-center">
								Enter text or URL to generate<br />a QR code
							</p>
						</Card>
					)}
				</div>
			</div>
		</form>
	);
}
