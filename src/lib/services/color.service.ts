import {
	type ColorConvertInput,
	type ColorOutput,
	type Result,
	ok,
	err,
} from "./types";

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

interface HSV {
	h: number;
	s: number;
	v: number;
}

function hexToRgb(hex: string): RGB | null {
	// Handle 3-digit hex
	let normalizedHex = hex.replace(/^#/, "");
	if (normalizedHex.length === 3) {
		normalizedHex = normalizedHex
			.split("")
			.map((c) => c + c)
			.join("");
	}

	const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalizedHex);
	if (!result) return null;

	return {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16),
	};
}

function rgbToHex(r: number, g: number, b: number): string {
	return (
		"#" +
		[r, g, b]
			.map((x) =>
				Math.max(0, Math.min(255, Math.round(x)))
					.toString(16)
					.padStart(2, "0")
			)
			.join("")
	);
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

function rgbToHsv(r: number, g: number, b: number): HSV {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	const v = max;
	const d = max - min;
	const s = max === 0 ? 0 : d / max;

	if (max !== min) {
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
		v: Math.round(v * 100),
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

function parseRgbString(str: string): RGB | null {
	const match = str.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
	if (!match) return null;
	return {
		r: parseInt(match[1], 10),
		g: parseInt(match[2], 10),
		b: parseInt(match[3], 10),
	};
}

function parseHslString(str: string): HSL | null {
	const match = str.match(/hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
	if (!match) return null;
	return {
		h: parseInt(match[1], 10),
		s: parseInt(match[2], 10),
		l: parseInt(match[3], 10),
	};
}

/**
 * Convert color between formats
 */
export function convertColor(input: ColorConvertInput): Result<ColorOutput> {
	const { color } = input;
	let rgb: RGB | null = null;

	// Try to parse the color in different formats
	// Hex
	if (color.match(/^#?([a-f\d]{3}|[a-f\d]{6})$/i)) {
		rgb = hexToRgb(color);
	}
	// RGB string
	else if (color.match(/^rgba?\s*\(/i)) {
		rgb = parseRgbString(color);
	}
	// HSL string
	else if (color.match(/^hsla?\s*\(/i)) {
		const hsl = parseHslString(color);
		if (hsl) {
			rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
		}
	}

	if (!rgb) {
		return err("Invalid color format. Supported: #hex, rgb(), hsl()");
	}

	const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
	const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
	const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

	return ok({
		hex,
		rgb,
		hsl,
		hsv,
		css: {
			hex,
			rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
			hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
		},
	});
}
