export type Category =
	| "encoding"
	| "data"
	| "generators"
	| "text"
	| "utilities";

export interface Tool {
	id: string;
	name: string;
	description: string;
	href: string;
	category: Category;
	keywords: string[];
}

export const categories: Record<Category, { label: string; color: string }> = {
	encoding: {
		label: "Encoding",
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
		label: "Text & Analysis",
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
		name: "Base64",
		description: "Encode and decode Base64 strings",
		href: "/base64",
		category: "encoding",
		keywords: ["base64", "encode", "decode", "binary", "text"],
	},
	{
		id: "url",
		name: "URL",
		description: "Encode and decode URL components",
		href: "/url",
		category: "encoding",
		keywords: ["url", "encode", "decode", "uri", "percent", "escape"],
	},
	{
		id: "jwt",
		name: "JWT",
		description: "Decode and inspect JWT tokens",
		href: "/jwt",
		category: "encoding",
		keywords: ["jwt", "token", "decode", "json", "web", "auth"],
	},
	{
		id: "qr",
		name: "QR Code",
		description: "Generate QR codes from text",
		href: "/qr",
		category: "encoding",
		keywords: ["qr", "code", "generate", "barcode", "scan"],
	},
	{
		id: "base",
		name: "Number Base",
		description: "Convert between number bases",
		href: "/base",
		category: "encoding",
		keywords: ["binary", "hex", "octal", "decimal", "convert", "base"],
	},

	// Data Formats
	{
		id: "json",
		name: "JSON",
		description: "Format and validate JSON data",
		href: "/json",
		category: "data",
		keywords: ["json", "format", "validate", "parse", "minify", "beautify"],
	},
	{
		id: "yaml",
		name: "YAML",
		description: "Convert between YAML and JSON",
		href: "/yaml",
		category: "data",
		keywords: ["yaml", "json", "convert", "parse", "config"],
	},
	{
		id: "env",
		name: "ENV",
		description: "Convert between ENV and JSON formats",
		href: "/env",
		category: "data",
		keywords: ["env", "environment", "dotenv", "json", "convert"],
	},
	{
		id: "sql",
		name: "SQL",
		description: "Format and beautify SQL queries",
		href: "/sql",
		category: "data",
		keywords: ["sql", "format", "beautify", "query", "database"],
	},

	// Generators
	{
		id: "uuid",
		name: "UUID",
		description: "Generate UUIDs v4 and v7",
		href: "/uuid",
		category: "generators",
		keywords: ["uuid", "guid", "generate", "unique", "id", "v4", "v7"],
	},
	{
		id: "hash",
		name: "Hash",
		description: "Generate SHA hashes from text",
		href: "/hash",
		category: "generators",
		keywords: ["hash", "sha", "sha256", "sha512", "checksum", "crypto"],
	},
	{
		id: "lorem",
		name: "Lorem",
		description: "Generate placeholder text",
		href: "/lorem",
		category: "generators",
		keywords: ["lorem", "ipsum", "placeholder", "text", "dummy"],
	},
	{
		id: "password",
		name: "Password",
		description: "Generate secure random passwords",
		href: "/password",
		category: "generators",
		keywords: ["password", "generate", "random", "secure", "strong"],
	},

	// Text & Analysis
	{
		id: "diff",
		name: "Diff",
		description: "Compare two text inputs",
		href: "/diff",
		category: "text",
		keywords: ["diff", "compare", "difference", "text", "merge"],
	},
	{
		id: "regex",
		name: "Regex",
		description: "Test regular expressions",
		href: "/regex",
		category: "text",
		keywords: ["regex", "regular", "expression", "pattern", "match", "test"],
	},
	{
		id: "markdown",
		name: "Markdown",
		description: "Preview markdown with live rendering",
		href: "/markdown",
		category: "text",
		keywords: ["markdown", "md", "preview", "render", "format"],
	},
	{
		id: "cron",
		name: "Cron",
		description: "Parse and explain cron expressions",
		href: "/cron",
		category: "text",
		keywords: ["cron", "schedule", "job", "time", "expression", "parse"],
	},

	// Utilities
	{
		id: "timestamp",
		name: "Timestamp",
		description: "Convert Unix timestamps to dates",
		href: "/timestamp",
		category: "utilities",
		keywords: ["timestamp", "unix", "date", "time", "convert", "epoch"],
	},
	{
		id: "color",
		name: "Color",
		description: "Convert between color formats",
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
