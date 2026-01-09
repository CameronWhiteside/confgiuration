import type { Metadata } from "next";
import { tools, getTool, categories } from "./tools";
import { getToolContent } from "./content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://confgiuration.dev";
const siteName = "confgiuration";

// Extended tool descriptions for SEO
export const toolSeoData: Record<
	string,
	{
		title: string;
		description: string;
		keywords: string[];
		h1: string;
		intro: string;
	}
> = {
	base64: {
		title: "Base64 Encoder/Decoder - Encode & Decode Base64 Online",
		description:
			"Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 to text instantly. Supports UTF-8, handles binary data, and works entirely in your browser.",
		keywords: [
			"base64 encoder",
			"base64 decoder",
			"base64 online",
			"encode base64",
			"decode base64",
			"base64 converter",
			"base64 to text",
			"text to base64",
			"binary to base64",
		],
		h1: "Base64 Encoder & Decoder",
		intro:
			"Encode text to Base64 or decode Base64 strings instantly. Perfect for data URLs, API authentication, and encoding binary data for transmission.",
	},
	url: {
		title: "URL Encoder/Decoder - Encode & Decode URLs Online",
		description:
			"Free online URL encoder and decoder. Percent-encode special characters for URLs or decode URL-encoded strings. Essential tool for web developers working with query parameters.",
		keywords: [
			"url encoder",
			"url decoder",
			"percent encoding",
			"url encode online",
			"decode url",
			"uri encoder",
			"encodeURIComponent",
			"query string encoder",
		],
		h1: "URL Encoder & Decoder",
		intro:
			"Encode special characters for URLs or decode percent-encoded strings. Handles all special characters including spaces, ampersands, and Unicode.",
	},
	jwt: {
		title: "JWT Decoder - Decode & Inspect JSON Web Tokens Online",
		description:
			"Free online JWT decoder and inspector. Decode JSON Web Tokens to view header, payload, and signature. Verify token structure and inspect claims without sharing your secret.",
		keywords: [
			"jwt decoder",
			"jwt parser",
			"decode jwt",
			"json web token decoder",
			"jwt inspector",
			"jwt debugger",
			"jwt viewer",
			"jwt token decoder",
		],
		h1: "JWT Decoder & Inspector",
		intro:
			"Decode and inspect JSON Web Tokens (JWT). View the header, payload claims, and signature. All processing happens in your browser - tokens never leave your device.",
	},
	qr: {
		title: "QR Code Generator - Create QR Codes Online Free",
		description:
			"Free online QR code generator. Create QR codes for URLs, text, WiFi, vCards, and more. Download as PNG or SVG. Customize size and error correction level.",
		keywords: [
			"qr code generator",
			"create qr code",
			"qr code maker",
			"free qr code",
			"qr code online",
			"generate qr code",
			"qr code creator",
			"url to qr code",
		],
		h1: "QR Code Generator",
		intro:
			"Generate QR codes for any text, URL, or data. Customize the size and error correction level. Download in PNG or SVG format.",
	},
	base: {
		title: "Number Base Converter - Binary, Hex, Octal, Decimal",
		description:
			"Free online number base converter. Convert between binary, octal, decimal, and hexadecimal. Essential tool for programmers working with different number systems.",
		keywords: [
			"number base converter",
			"binary converter",
			"hex converter",
			"octal converter",
			"decimal to binary",
			"binary to hex",
			"hex to decimal",
			"base conversion",
		],
		h1: "Number Base Converter",
		intro:
			"Convert numbers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16). Instant conversion as you type.",
	},
	json: {
		title: "JSON Formatter & Validator - Format & Beautify JSON Online",
		description:
			"Free online JSON formatter, validator, and beautifier. Format messy JSON with proper indentation, validate syntax, and minify JSON data. Supports large files.",
		keywords: [
			"json formatter",
			"json validator",
			"json beautifier",
			"format json",
			"pretty print json",
			"json minifier",
			"json lint",
			"json parser",
			"validate json",
		],
		h1: "JSON Formatter & Validator",
		intro:
			"Format, validate, and beautify JSON data. Fix indentation, validate syntax, or minify for production. Handles large JSON files with ease.",
	},
	yaml: {
		title: "YAML to JSON Converter - Convert YAML & JSON Online",
		description:
			"Free online YAML to JSON converter and JSON to YAML converter. Transform configuration files between formats instantly. Validates YAML syntax.",
		keywords: [
			"yaml to json",
			"json to yaml",
			"yaml converter",
			"yaml parser",
			"convert yaml",
			"yaml validator",
			"yaml formatter",
			"yaml to json online",
		],
		h1: "YAML ↔ JSON Converter",
		intro:
			"Convert between YAML and JSON formats. Perfect for transforming configuration files, Kubernetes manifests, and CI/CD pipelines.",
	},
	env: {
		title: "ENV to JSON Converter - Convert Environment Variables",
		description:
			"Free online ENV to JSON converter. Transform .env files to JSON format and vice versa. Parse environment variables for configuration management.",
		keywords: [
			"env to json",
			"json to env",
			"dotenv converter",
			"environment variables",
			"env parser",
			"env file converter",
			".env to json",
			"convert env file",
		],
		h1: "ENV ↔ JSON Converter",
		intro:
			"Convert between .env files and JSON format. Transform environment variables for different configuration systems.",
	},
	sql: {
		title: "SQL Formatter - Format & Beautify SQL Queries Online",
		description:
			"Free online SQL formatter and beautifier. Format messy SQL queries with proper indentation, keywords uppercase, and consistent style. Supports all major SQL dialects.",
		keywords: [
			"sql formatter",
			"sql beautifier",
			"format sql",
			"sql pretty print",
			"sql linter",
			"sql query formatter",
			"format sql online",
			"sql code formatter",
		],
		h1: "SQL Formatter & Beautifier",
		intro:
			"Format and beautify SQL queries instantly. Proper indentation, uppercase keywords, and consistent style. Supports MySQL, PostgreSQL, SQL Server, and more.",
	},
	uuid: {
		title: "UUID Generator - Generate UUID v4 & v7 Online",
		description:
			"Free online UUID generator. Generate UUID v4 (random) and UUID v7 (time-based) identifiers. Copy single or bulk generate multiple UUIDs instantly.",
		keywords: [
			"uuid generator",
			"generate uuid",
			"uuid v4",
			"uuid v7",
			"guid generator",
			"random uuid",
			"unique id generator",
			"uuid online",
		],
		h1: "UUID Generator",
		intro:
			"Generate universally unique identifiers (UUIDs). Choose between random v4 or time-based v7 formats. Generate single or bulk UUIDs.",
	},
	hash: {
		title: "Hash Generator - SHA256, SHA512, MD5 Hash Online",
		description:
			"Free online hash generator. Generate SHA-256, SHA-512, SHA-1, and MD5 hashes from text. Calculate checksums for file integrity verification.",
		keywords: [
			"hash generator",
			"sha256 generator",
			"sha512 generator",
			"md5 generator",
			"hash calculator",
			"checksum generator",
			"sha hash online",
			"generate hash",
		],
		h1: "Hash Generator",
		intro:
			"Generate cryptographic hashes using SHA-256, SHA-512, SHA-1, or MD5. Calculate checksums for data integrity verification.",
	},
	lorem: {
		title: "Lorem Ipsum Generator - Generate Placeholder Text",
		description:
			"Free online Lorem Ipsum generator. Generate placeholder text for design mockups. Choose paragraphs, sentences, or words. Copy with one click.",
		keywords: [
			"lorem ipsum generator",
			"placeholder text",
			"dummy text generator",
			"lorem ipsum",
			"fake text generator",
			"sample text",
			"filler text",
			"generate lorem ipsum",
		],
		h1: "Lorem Ipsum Generator",
		intro:
			"Generate Lorem Ipsum placeholder text for your designs and mockups. Choose the number of paragraphs, sentences, or words.",
	},
	password: {
		title: "Password Generator - Generate Secure Random Passwords",
		description:
			"Free online secure password generator. Generate strong, random passwords with customizable length and character types. Cryptographically secure generation.",
		keywords: [
			"password generator",
			"random password",
			"secure password generator",
			"strong password generator",
			"password creator",
			"generate password",
			"random password generator",
		],
		h1: "Secure Password Generator",
		intro:
			"Generate cryptographically secure random passwords. Customize length, include uppercase, lowercase, numbers, and symbols.",
	},
	diff: {
		title: "Text Diff Checker - Compare Text Differences Online",
		description:
			"Free online text diff checker. Compare two texts and highlight differences. See additions, deletions, and changes side by side or inline.",
		keywords: [
			"diff checker",
			"text compare",
			"compare text",
			"text diff",
			"difference checker",
			"compare files online",
			"text comparison tool",
			"diff tool",
		],
		h1: "Text Diff Checker",
		intro:
			"Compare two pieces of text and see the differences highlighted. View additions, deletions, and changes in side-by-side or inline mode.",
	},
	regex: {
		title: "Regex Tester - Test Regular Expressions Online",
		description:
			"Free online regex tester. Test and debug regular expressions with real-time matching. See matches highlighted and capture groups explained.",
		keywords: [
			"regex tester",
			"regex online",
			"regular expression tester",
			"regex checker",
			"test regex",
			"regex debugger",
			"regex validator",
			"regexp tester",
		],
		h1: "Regex Tester & Debugger",
		intro:
			"Test regular expressions with real-time matching. See matches highlighted, capture groups extracted, and get explanations for your patterns.",
	},
	markdown: {
		title: "Markdown Preview - Live Markdown Editor & Viewer",
		description:
			"Free online Markdown preview and editor. Write Markdown and see live HTML preview. Supports GitHub Flavored Markdown with tables, code blocks, and more.",
		keywords: [
			"markdown preview",
			"markdown editor",
			"markdown viewer",
			"markdown online",
			"markdown to html",
			"live markdown",
			"gfm preview",
			"markdown renderer",
		],
		h1: "Markdown Preview",
		intro:
			"Write Markdown and see a live preview rendered as HTML. Supports GitHub Flavored Markdown including tables, code blocks, and task lists.",
	},
	cron: {
		title: "Cron Expression Parser - Explain Cron Schedules",
		description:
			"Free online cron expression parser. Understand cron schedules with human-readable explanations. See next run times and validate cron syntax.",
		keywords: [
			"cron parser",
			"cron expression",
			"cron generator",
			"cron schedule",
			"cron validator",
			"explain cron",
			"cron syntax",
			"crontab",
		],
		h1: "Cron Expression Parser",
		intro:
			"Parse and explain cron expressions in human-readable format. See when jobs will run and validate your cron syntax.",
	},
	timestamp: {
		title: "Unix Timestamp Converter - Convert Dates & Timestamps",
		description:
			"Free online Unix timestamp converter. Convert between Unix timestamps and human-readable dates. Support for seconds and milliseconds.",
		keywords: [
			"timestamp converter",
			"unix timestamp",
			"epoch converter",
			"timestamp to date",
			"date to timestamp",
			"unix time",
			"epoch time",
			"timestamp online",
		],
		h1: "Unix Timestamp Converter",
		intro:
			"Convert between Unix timestamps and human-readable dates. Supports seconds, milliseconds, and various date formats.",
	},
	color: {
		title: "Color Converter - HEX, RGB, HSL Color Conversion",
		description:
			"Free online color converter. Convert between HEX, RGB, HSL, and other color formats. Pick colors and copy values instantly.",
		keywords: [
			"color converter",
			"hex to rgb",
			"rgb to hex",
			"color picker",
			"hsl converter",
			"color code converter",
			"hex color",
			"rgb color",
		],
		h1: "Color Converter",
		intro:
			"Convert colors between HEX, RGB, HSL, and other formats. Pick colors visually or enter values directly.",
	},
};

// Generate metadata for a tool page
export function generateToolMetadata(toolId: string): Metadata {
	const tool = getTool(toolId);
	const seoData = toolSeoData[toolId];
	const content = getToolContent(toolId);

	if (!tool || !seoData) {
		return {
			title: "Tool Not Found",
			description: "The requested tool was not found.",
		};
	}

	const category = categories[tool.category];
	const articleKeywords = content?.articles.flatMap((a) => a.tags) || [];

	return {
		title: seoData.title,
		description: seoData.description,
		keywords: [...seoData.keywords, ...tool.keywords, ...articleKeywords],
		openGraph: {
			title: seoData.title,
			description: seoData.description,
			url: `${siteUrl}${tool.href}`,
			siteName: siteName,
			type: "website",
			images: [
				{
					url: `/og/${toolId}.png`,
					width: 1200,
					height: 630,
					alt: seoData.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: seoData.title,
			description: seoData.description,
			images: [`/og/${toolId}.png`],
		},
		alternates: {
			canonical: `${siteUrl}${tool.href}`,
		},
		other: {
			"article:section": category.label,
		},
	};
}

// Generate JSON-LD structured data for a tool
export function generateToolJsonLd(toolId: string) {
	const tool = getTool(toolId);
	const seoData = toolSeoData[toolId];
	const content = getToolContent(toolId);

	if (!tool || !seoData) return null;

	const category = categories[tool.category];

	// Main WebApplication schema
	const webApp = {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name: tool.name,
		description: seoData.description,
		url: `${siteUrl}${tool.href}`,
		applicationCategory: "DeveloperApplication",
		operatingSystem: "Any",
		browserRequirements: "Requires JavaScript",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
		featureList: seoData.keywords.slice(0, 5).join(", "),
		screenshot: `${siteUrl}/og/${toolId}.png`,
		softwareHelp: {
			"@type": "CreativeWork",
			name: `${tool.name} Guide`,
			url: `${siteUrl}${tool.href}#learn-more`,
		},
	};

	// BreadcrumbList schema
	const breadcrumbs = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: siteUrl,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: category.label,
				item: `${siteUrl}/?category=${tool.category}`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: tool.name,
				item: `${siteUrl}${tool.href}`,
			},
		],
	};

	// FAQPage schema if there are articles
	const faq =
		content && content.articles.length > 0
			? {
					"@context": "https://schema.org",
					"@type": "FAQPage",
					mainEntity: content.articles.slice(0, 5).map((article) => ({
						"@type": "Question",
						name: article.title,
						acceptedAnswer: {
							"@type": "Answer",
							text: article.description,
						},
					})),
				}
			: null;

	// HowTo schema for the tool
	const howTo = {
		"@context": "https://schema.org",
		"@type": "HowTo",
		name: `How to use ${tool.name}`,
		description: seoData.intro,
		step: [
			{
				"@type": "HowToStep",
				name: "Enter your data",
				text: `Enter or paste your data into the ${tool.name} input field`,
			},
			{
				"@type": "HowToStep",
				name: "Process the data",
				text: "Click the action button to process your data",
			},
			{
				"@type": "HowToStep",
				name: "Copy the result",
				text: "Copy the output to your clipboard with one click",
			},
		],
		tool: {
			"@type": "HowToTool",
			name: tool.name,
		},
	};

	return [webApp, breadcrumbs, howTo, faq].filter(Boolean);
}

// Get all tools for sitemap generation
export function getAllToolsForSitemap() {
	return tools.map((tool) => ({
		url: `${siteUrl}${tool.href}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: 0.8,
	}));
}

// Get site URL
export function getSiteUrl() {
	return siteUrl;
}
