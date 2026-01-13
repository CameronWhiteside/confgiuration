"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CopyIconButton } from "@/components/ui/copy-button";

interface RGB {
	r: number;
	g: number;
	b: number;
}

interface HSL {
	h: number;
	s: number;
	l: number;
}

interface ColorFormProps {
	initialHex: string;
	initialRgb: RGB;
	initialHsl: HSL;
}

export function ColorForm({ initialHex, initialRgb, initialHsl }: ColorFormProps) {
	const [hex, setHex] = useState(initialHex);
	const [rgb, setRgb] = useState<RGB>(initialRgb);
	const [hsl, setHsl] = useState<HSL>(initialHsl);
	const [isPending, startTransition] = useTransition();

	const updateFromColor = (color: string) => {
		startTransition(async () => {
			try {
				const res = await fetch("/api/color/convert", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ color }),
				});

				const data = await res.json() as { success: boolean; data?: { hex: string; rgb: RGB; hsl: HSL } };

				if (data.success && data.data) {
					setHex(data.data.hex);
					setRgb(data.data.rgb);
					setHsl(data.data.hsl);
				}
			} catch {
				// Keep existing values on error
			}
		});
	};

	const handleHexChange = (value: string) => {
		setHex(value);
		if (value.match(/^#?([a-f\d]{3}|[a-f\d]{6})$/i)) {
			updateFromColor(value);
		}
	};

	const handleRgbChange = (key: keyof RGB, value: number) => {
		const newRgb = { ...rgb, [key]: Math.min(255, Math.max(0, value)) };
		setRgb(newRgb);
		updateFromColor(`rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`);
	};

	const handleHslChange = (key: keyof HSL, value: number) => {
		const max = key === "h" ? 360 : 100;
		const newHsl = { ...hsl, [key]: Math.min(max, Math.max(0, value)) };
		setHsl(newHsl);
		updateFromColor(`hsl(${newHsl.h}, ${newHsl.s}%, ${newHsl.l}%)`);
	};

	const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
	const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

	return (
		<div className="space-y-6">
			{/* Color Preview */}
			<div
				className="relative h-40 rounded-xl border border-border overflow-hidden transition-colors"
				style={{ backgroundColor: hex }}
			>
				<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
					<div className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-foreground font-mono text-sm">
						{hex.toUpperCase()}
						{isPending && <span className="ml-2 text-xs opacity-60">...</span>}
					</div>
					<input
						type="color"
						value={hex}
						onChange={(e) => handleHexChange(e.target.value)}
						className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white shadow-lg"
					/>
				</div>
			</div>

			{/* Color Values Grid */}
			<form method="GET" action="/color">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					{/* HEX */}
					<Card hover={false}>
						<h3 className="font-mono text-sm font-medium text-foreground-muted uppercase tracking-wider mb-3">
							HEX
						</h3>
						<div className="flex gap-2">
							<Input
								name="hex"
								value={hex}
								onChange={(e) => handleHexChange(e.target.value)}
								className="font-mono"
							/>
							<CopyIconButton text={hex} />
						</div>
					</Card>

					{/* RGB */}
					<Card hover={false}>
						<h3 className="font-mono text-sm font-medium text-foreground-muted uppercase tracking-wider mb-3">
							RGB
						</h3>
						<div className="grid grid-cols-3 gap-2 mb-3">
							<div>
								<label className="block text-xs text-foreground-muted mb-1">R</label>
								<Input
									type="number"
									min={0}
									max={255}
									value={rgb.r}
									onChange={(e) => handleRgbChange("r", Number(e.target.value))}
								/>
							</div>
							<div>
								<label className="block text-xs text-foreground-muted mb-1">G</label>
								<Input
									type="number"
									min={0}
									max={255}
									value={rgb.g}
									onChange={(e) => handleRgbChange("g", Number(e.target.value))}
								/>
							</div>
							<div>
								<label className="block text-xs text-foreground-muted mb-1">B</label>
								<Input
									type="number"
									min={0}
									max={255}
									value={rgb.b}
									onChange={(e) => handleRgbChange("b", Number(e.target.value))}
								/>
							</div>
						</div>
						<div className="flex gap-2">
							<div className="flex-1 bg-background-secondary rounded-lg p-2 font-mono text-sm">
								{rgbString}
							</div>
							<CopyIconButton text={rgbString} />
						</div>
					</Card>

					{/* HSL */}
					<Card hover={false}>
						<h3 className="font-mono text-sm font-medium text-foreground-muted uppercase tracking-wider mb-3">
							HSL
						</h3>
						<div className="grid grid-cols-3 gap-2 mb-3">
							<div>
								<label className="block text-xs text-foreground-muted mb-1">H</label>
								<Input
									type="number"
									min={0}
									max={360}
									value={hsl.h}
									onChange={(e) => handleHslChange("h", Number(e.target.value))}
								/>
							</div>
							<div>
								<label className="block text-xs text-foreground-muted mb-1">S%</label>
								<Input
									type="number"
									min={0}
									max={100}
									value={hsl.s}
									onChange={(e) => handleHslChange("s", Number(e.target.value))}
								/>
							</div>
							<div>
								<label className="block text-xs text-foreground-muted mb-1">L%</label>
								<Input
									type="number"
									min={0}
									max={100}
									value={hsl.l}
									onChange={(e) => handleHslChange("l", Number(e.target.value))}
								/>
							</div>
						</div>
						<div className="flex gap-2">
							<div className="flex-1 bg-background-secondary rounded-lg p-2 font-mono text-sm">
								{hslString}
							</div>
							<CopyIconButton text={hslString} />
						</div>
					</Card>
				</div>

				<noscript>
					<button
						type="submit"
						className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
					>
						Convert
					</button>
				</noscript>
			</form>
		</div>
	);
}
