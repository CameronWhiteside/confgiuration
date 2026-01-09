export type Category =
	| "encoding"
	| "data"
	| "generators"
	| "text"
	| "utilities";

export interface Tool {
	id: string;
	name: string;
	shortName: string;
	description: string;
	href: string;
	category: Category;
	keywords: string[];
}

export const categories: Record<Category, { label: string; color: string }> = {
	encoding: {
		label: "Encode & Decode",
		color: "from-violet-500 to-purple-500",
	},
	data: {
		label: "Data Formats",
		color: "from-blue-500 to-cyan-500",
	},
	generators: {
		label: "Generators",
		color: "from-pink-500 to-rose-500",
	},
	text: {
		label: "Text Tools",
		color: "from-amber-500 to-orange-500",
	},
	utilities: {
		label: "Utilities",
		color: "from-emerald-500 to-teal-500",
	},
};

export const tools: Tool[] = [
	// Encoding & Decoding
	{
		id: "base64",
		name: "Base64 Encoder & Decoder",
		shortName: "Base64",
		description: "Convert text to Base64 and back instantly",
		href: "/base64",
		category: "encoding",
		keywords: ["base64", "encode", "decode", "binary", "text"],
	},
	{
		id: "url",
		name: "URL Encoder & Decoder",
		shortName: "URL Encode",
		description: "Safely encode special characters for URLs",
		href: "/url",
		category: "encoding",
		keywords: ["url", "encode", "decode", "uri", "percent", "escape"],
	},
	{
		id: "jwt",
		name: "JWT Token Decoder",
		shortName: "JWT Decode",
		description: "Decode and inspect JSON Web Tokens",
		href: "/jwt",
		category: "encoding",
		keywords: ["jwt", "token", "decode", "json", "web", "auth"],
	},
	{
		id: "qr",
		name: "QR Code Generator",
		shortName: "QR Code",
		description: "Create QR codes from any text or URL",
		href: "/qr",
		category: "encoding",
		keywords: ["qr", "code", "generate", "barcode", "scan"],
	},
	{
		id: "base",
		name: "Number Base Converter",
		shortName: "Base Convert",
		description: "Convert between binary, hex, octal, and decimal",
		href: "/base",
		category: "encoding",
		keywords: ["binary", "hex", "octal", "decimal", "convert", "base"],
	},

	// Data Formats
	{
		id: "json",
		name: "JSON Formatter & Validator",
		shortName: "JSON Format",
		description: "Beautify, minify, and validate JSON data",
		href: "/json",
		category: "data",
		keywords: ["json", "format", "validate", "parse", "minify", "beautify"],
	},
	{
		id: "yaml",
		name: "YAML to JSON Converter",
		shortName: "YAML Convert",
		description: "Convert between YAML and JSON formats",
		href: "/yaml",
		category: "data",
		keywords: ["yaml", "json", "convert", "parse", "config"],
	},
	{
		id: "env",
		name: "ENV File Converter",
		shortName: "ENV Convert",
		description: "Convert .env files to JSON and back",
		href: "/env",
		category: "data",
		keywords: ["env", "environment", "dotenv", "json", "convert"],
	},
	{
		id: "sql",
		name: "SQL Formatter & Beautifier",
		shortName: "SQL Format",
		description: "Format messy SQL queries into readable code",
		href: "/sql",
		category: "data",
		keywords: ["sql", "format", "beautify", "query", "database"],
	},

	// Generators
	{
		id: "uuid",
		name: "UUID Generator",
		shortName: "UUID",
		description: "Generate unique UUIDs (v4 random, v7 timestamp)",
		href: "/uuid",
		category: "generators",
		keywords: ["uuid", "guid", "generate", "unique", "id", "v4", "v7"],
	},
	{
		id: "hash",
		name: "Hash Generator (SHA)",
		shortName: "SHA Hash",
		description: "Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes",
		href: "/hash",
		category: "generators",
		keywords: ["hash", "sha", "sha256", "sha512", "checksum", "crypto"],
	},
	{
		id: "lorem",
		name: "Lorem Ipsum Generator",
		shortName: "Lorem Ipsum",
		description: "Generate placeholder text for designs",
		href: "/lorem",
		category: "generators",
		keywords: ["lorem", "ipsum", "placeholder", "text", "dummy"],
	},
	{
		id: "password",
		name: "Secure Password Generator",
		shortName: "Password",
		description: "Create strong, random passwords instantly",
		href: "/password",
		category: "generators",
		keywords: ["password", "generate", "random", "secure", "strong"],
	},

	// Text & Analysis
	{
		id: "diff",
		name: "Text Diff Checker",
		shortName: "Diff",
		description: "Compare two texts and highlight differences",
		href: "/diff",
		category: "text",
		keywords: ["diff", "compare", "difference", "text", "merge"],
	},
	{
		id: "regex",
		name: "Regex Tester",
		shortName: "Regex",
		description: "Test and debug regular expressions live",
		href: "/regex",
		category: "text",
		keywords: ["regex", "regular", "expression", "pattern", "match", "test"],
	},
	{
		id: "markdown",
		name: "Markdown Preview",
		shortName: "Markdown",
		description: "Write Markdown and see live HTML preview",
		href: "/markdown",
		category: "text",
		keywords: ["markdown", "md", "preview", "render", "format"],
	},
	{
		id: "cron",
		name: "Cron Expression Parser",
		shortName: "Cron",
		description: "Understand cron schedules in plain English",
		href: "/cron",
		category: "text",
		keywords: ["cron", "schedule", "job", "time", "expression", "parse"],
	},

	// Utilities
	{
		id: "timestamp",
		name: "Unix Timestamp Converter",
		shortName: "Timestamp",
		description: "Convert between Unix timestamps and dates",
		href: "/timestamp",
		category: "utilities",
		keywords: ["timestamp", "unix", "date", "time", "convert", "epoch"],
	},
	{
		id: "color",
		name: "Color Format Converter",
		shortName: "Color",
		description: "Convert between HEX, RGB, and HSL colors",
		href: "/color",
		category: "utilities",
		keywords: ["color", "hex", "rgb", "hsl", "convert", "picker"],
	},
];

export function searchTools(query: string): Tool[] {
	if (!query.trim()) return tools;

	const lowerQuery = query.toLowerCase();
	return tools.filter(
		(tool) =>
			tool.name.toLowerCase().includes(lowerQuery) ||
			tool.shortName.toLowerCase().includes(lowerQuery) ||
			tool.description.toLowerCase().includes(lowerQuery) ||
			tool.keywords.some((keyword) => keyword.includes(lowerQuery))
	);
}

export function getToolsByCategory(category: Category): Tool[] {
	return tools.filter((tool) => tool.category === category);
}

export function getTool(id: string): Tool | undefined {
	return tools.find((tool) => tool.id === id);
}
