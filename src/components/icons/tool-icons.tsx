import { type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

// Base64 - layers/stack
export function Base64Icon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<rect x="4" y="4" width="16" height="6" rx="1" />
			<rect x="4" y="14" width="16" height="6" rx="1" />
			<path d="M8 7h8" />
			<path d="M8 17h8" />
		</svg>
	);
}

// URL - link
export function UrlIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
			<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
		</svg>
	);
}

// JWT - key/token
export function JwtIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<circle cx="8" cy="15" r="4" />
			<path d="M10.85 12.15 19 4" />
			<path d="m18 5 2-2" />
			<path d="m15 8 2-2" />
		</svg>
	);
}

// QR Code - grid pattern
export function QrIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<rect x="3" y="3" width="7" height="7" rx="1" />
			<rect x="14" y="3" width="7" height="7" rx="1" />
			<rect x="3" y="14" width="7" height="7" rx="1" />
			<rect x="14" y="14" width="3" height="3" />
			<path d="M18 14h3v3" />
			<path d="M14 18h3v3" />
			<path d="M18 18h3v3" />
		</svg>
	);
}

// Number Base - hash/binary
export function BaseIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M4 9h16" />
			<path d="M4 15h16" />
			<path d="M10 3 8 21" />
			<path d="M16 3 14 21" />
		</svg>
	);
}

// JSON - braces
export function JsonIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M8 3H6a2 2 0 0 0-2 2v3.5a2.5 2.5 0 0 1-2 2.5 2.5 2.5 0 0 1 2 2.5V18a2 2 0 0 0 2 2h2" />
			<path d="M16 3h2a2 2 0 0 1 2 2v3.5a2.5 2.5 0 0 0 2 2.5 2.5 2.5 0 0 0-2 2.5V18a2 2 0 0 1-2 2h-2" />
		</svg>
	);
}

// YAML - document with lines
export function YamlIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<path d="M14 2v6h6" />
			<path d="M8 13h2" />
			<path d="M10 17h4" />
			<path d="M8 17h.01" />
		</svg>
	);
}

// ENV - config/settings
export function EnvIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<circle cx="12" cy="12" r="3" />
			<path d="M12 1v6" />
			<path d="M12 17v6" />
			<path d="m4.22 4.22 4.24 4.24" />
			<path d="m15.54 15.54 4.24 4.24" />
			<path d="M1 12h6" />
			<path d="M17 12h6" />
			<path d="m4.22 19.78 4.24-4.24" />
			<path d="m15.54 8.46 4.24-4.24" />
		</svg>
	);
}

// SQL - database
export function SqlIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<ellipse cx="12" cy="5" rx="9" ry="3" />
			<path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
			<path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
		</svg>
	);
}

// UUID - fingerprint/id
export function UuidIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
			<path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
			<path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
			<path d="M2 12a10 10 0 0 1 18-6" />
			<path d="M2 16h.01" />
			<path d="M21.8 16c.2-2 .131-5.354 0-6" />
			<path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
			<path d="M8.65 22c.21-.66.45-1.32.57-2" />
			<path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
		</svg>
	);
}

// Hash - shield/lock
export function HashIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
			<path d="m9 12 2 2 4-4" />
		</svg>
	);
}

// Lorem - text/paragraph
export function LoremIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M17 6H3" />
			<path d="M21 12H8" />
			<path d="M21 18H8" />
			<path d="M3 12h.01" />
			<path d="M3 18h.01" />
		</svg>
	);
}

// Password - lock
export function PasswordIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
			<path d="M7 11V7a5 5 0 0 1 10 0v4" />
			<circle cx="12" cy="16" r="1" />
		</svg>
	);
}

// Diff - git compare
export function DiffIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M12 3v14" />
			<path d="m8 10 4 4 4-4" />
			<path d="M19 21H5" />
			<path d="M5 21v-4" />
			<path d="M19 21v-4" />
		</svg>
	);
}

// Regex - asterisk/pattern
export function RegexIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M12 5v14" />
			<path d="m5 8 14 8" />
			<path d="m5 16 14-8" />
		</svg>
	);
}

// Markdown - M
export function MarkdownIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<rect x="2" y="4" width="20" height="16" rx="2" />
			<path d="M6 8v8" />
			<path d="M6 12h2l2-4v8" />
			<path d="M14 8l2 4 2-4" />
			<path d="M18 16v-8" />
		</svg>
	);
}

// Cron - clock/schedule
export function CronIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	);
}

// Timestamp - calendar/time
export function TimestampIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
			<line x1="16" y1="2" x2="16" y2="6" />
			<line x1="8" y1="2" x2="8" y2="6" />
			<line x1="3" y1="10" x2="21" y2="10" />
			<path d="M12 14v3" />
			<path d="M12 14l2 2" />
		</svg>
	);
}

// Color - palette
export function ColorIcon(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<circle cx="13.5" cy="6.5" r="2.5" />
			<circle cx="19" cy="12" r="2.5" />
			<circle cx="6.5" cy="12.5" r="2.5" />
			<circle cx="12" cy="19" r="2.5" />
			<path d="M12 2a10 10 0 0 0 0 20 2 2 0 0 0 2-2v-1a2 2 0 0 1 2-2h1a2 2 0 0 0 2-2 10 10 0 0 0-7-13Z" />
		</svg>
	);
}

// Tool icon map for easy access
export const toolIconMap: Record<
	string,
	(props: IconProps) => React.JSX.Element
> = {
	base64: Base64Icon,
	url: UrlIcon,
	jwt: JwtIcon,
	qr: QrIcon,
	base: BaseIcon,
	json: JsonIcon,
	yaml: YamlIcon,
	env: EnvIcon,
	sql: SqlIcon,
	uuid: UuidIcon,
	hash: HashIcon,
	lorem: LoremIcon,
	password: PasswordIcon,
	diff: DiffIcon,
	regex: RegexIcon,
	markdown: MarkdownIcon,
	cron: CronIcon,
	timestamp: TimestampIcon,
	color: ColorIcon,
};

// Get icon component by tool ID
export function getToolIcon(toolId: string) {
	return toolIconMap[toolId] || JsonIcon;
}
