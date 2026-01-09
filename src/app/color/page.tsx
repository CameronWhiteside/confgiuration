"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
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

function hexToRgb(hex: string): RGB | null {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (!result) return null;
	return {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16),
	};
}

function rgbToHex(r: number, g: number, b: number): string {
	return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): HSL {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
				break;
			case g:
				h = ((b - r) / d + 2) / 6;
				break;
			case b:
				h = ((r - g) / d + 4) / 6;
				break;
		}
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	};
}

function hslToRgb(h: number, s: number, l: number): RGB {
	h /= 360;
	s /= 100;
	l /= 100;

	let r, g, b;

	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255),
	};
}

export default function ColorPage() {
	const [hex, setHex] = useState("#8b5cf6");
	const [rgb, setRgb] = useState<RGB>({ r: 139, g: 92, b: 246 });
	const [hsl, setHsl] = useState<HSL>({ h: 263, s: 90, l: 66 });

	const updateFromHex = (value: string) => {
		setHex(value);
		const rgbValue = hexToRgb(value);
		if (rgbValue) {
			setRgb(rgbValue);
			setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b));
		}
	};

	const updateFromRgb = (key: keyof RGB, value: number) => {
		const newRgb = { ...rgb, [key]: Math.min(255, Math.max(0, value)) };
		setRgb(newRgb);
		setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
		setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
	};

	const updateFromHsl = (key: keyof HSL, value: number) => {
		const max = key === "h" ? 360 : 100;
		const newHsl = { ...hsl, [key]: Math.min(max, Math.max(0, value)) };
		setHsl(newHsl);
		const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
		setRgb(newRgb);
		setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
	};

	const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
	const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

	return (
		<ToolLayout toolId="color">
			<div className="space-y-6">
				{/* Color Preview */}
				<div
					className="relative h-40 rounded-xl border border-border overflow-hidden transition-colors"
					style={{ backgroundColor: hex }}
				>
					<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
						<div className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-foreground font-mono text-sm">
							{hex.toUpperCase()}
						</div>
						<input
							type="color"
							value={hex}
							onChange={(e) => updateFromHex(e.target.value)}
							className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white shadow-lg"
						/>
					</div>
				</div>

				{/* Color Values Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					{/* HEX */}
					<Card hover={false}>
						<h3 className="font-mono text-sm font-medium text-foreground-muted uppercase tracking-wider mb-3">
							HEX
						</h3>
						<div className="flex gap-2">
							<Input
								value={hex}
								onChange={(e) => updateFromHex(e.target.value)}
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
									onChange={(e) => updateFromRgb("r", Number(e.target.value))}
								/>
							</div>
							<div>
								<label className="block text-xs text-foreground-muted mb-1">G</label>
								<Input
									type="number"
									min={0}
									max={255}
									value={rgb.g}
									onChange={(e) => updateFromRgb("g", Number(e.target.value))}
								/>
							</div>
							<div>
								<label className="block text-xs text-foreground-muted mb-1">B</label>
								<Input
									type="number"
									min={0}
									max={255}
									value={rgb.b}
									onChange={(e) => updateFromRgb("b", Number(e.target.value))}
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
									onChange={(e) => updateFromHsl("h", Number(e.target.value))}
								/>
							</div>
							<div>
								<label className="block text-xs text-foreground-muted mb-1">S%</label>
								<Input
									type="number"
									min={0}
									max={100}
									value={hsl.s}
									onChange={(e) => updateFromHsl("s", Number(e.target.value))}
								/>
							</div>
							<div>
								<label className="block text-xs text-foreground-muted mb-1">L%</label>
								<Input
									type="number"
									min={0}
									max={100}
									value={hsl.l}
									onChange={(e) => updateFromHsl("l", Number(e.target.value))}
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
			</div>
		</ToolLayout>
	);
}
