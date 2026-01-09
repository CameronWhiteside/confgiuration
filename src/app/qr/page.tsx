"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Download, QrCode } from "lucide-react";

export default function QrPage() {
	const [input, setInput] = useState("");
	const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
	const [size, setSize] = useState(256);
	const [error, setError] = useState("");
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const generateQr = useCallback(async () => {
		if (!input.trim()) {
			setQrDataUrl(null);
			return;
		}

		setError("");
		try {
			const dataUrl = await QRCode.toDataURL(input, {
				width: size,
				margin: 2,
				color: {
					dark: "#18181b",
					light: "#ffffff",
				},
			});
			setQrDataUrl(dataUrl);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to generate QR code");
			setQrDataUrl(null);
		}
	}, [input, size]);

	const downloadQr = () => {
		if (!qrDataUrl) return;

		const link = document.createElement("a");
		link.download = "qrcode.png";
		link.href = qrDataUrl;
		link.click();
	};

	// Auto-generate on input change (debounced)
	useEffect(() => {
		const timeout = setTimeout(() => {
			if (input.trim()) {
				generateQr();
			} else {
				setQrDataUrl(null);
			}
		}, 300);

		return () => clearTimeout(timeout);
	}, [input, size, generateQr]);

	return (
		<ToolLayout toolId="qr">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Input Section */}
				<div className="space-y-4">
					<Textarea
						label="Content"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Enter text or URL to encode..."
						className="min-h-[200px]"
					/>

					<div className="flex gap-4">
						<div className="w-32">
							<Select
								label="Size"
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
							<Button onClick={generateQr} disabled={!input.trim()}>
								Generate QR Code
							</Button>
						</div>
					</div>

					{error && (
						<p className="text-sm text-error">{error}</p>
					)}
				</div>

				{/* Preview Section */}
				<div>
					<label className="block text-sm font-medium text-foreground-muted mb-2">
						Preview
					</label>
					{qrDataUrl ? (
						<Card hover={false} className="flex flex-col items-center p-8">
							<div className="bg-white p-4 rounded-xl shadow-md">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={qrDataUrl}
									alt="QR Code"
									className="max-w-full h-auto"
									style={{ imageRendering: "pixelated" }}
								/>
							</div>

							<Button
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

			{/* Hidden canvas for generation */}
			<canvas ref={canvasRef} className="hidden" />
		</ToolLayout>
	);
}
