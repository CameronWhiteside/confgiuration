/**
 * Shared types for all tool services
 * These types are used by SSR, API, and future MCP server
 */

// Generic result wrapper for all service operations
export type Result<T> =
	| { success: true; data: T }
	| { success: false; error: string };

// Helper to create success/error results
export function ok<T>(data: T): Result<T> {
	return { success: true, data };
}

export function err<T>(error: string): Result<T> {
	return { success: false, error };
}

// ============================================
// Base64 Service Types
// ============================================
export interface Base64EncodeInput {
	text: string;
	urlSafe?: boolean;
}

export interface Base64DecodeInput {
	base64: string;
	urlSafe?: boolean;
}

export interface Base64Output {
	result: string;
}

// ============================================
// URL Encode Service Types
// ============================================
export interface UrlEncodeInput {
	text: string;
	encodeComponent?: boolean; // true = encodeURIComponent, false = encodeURI
}

export interface UrlDecodeInput {
	url: string;
	decodeComponent?: boolean;
}

export interface UrlOutput {
	result: string;
}

// ============================================
// JSON Service Types
// ============================================
export interface JsonFormatInput {
	json: string;
	indent?: number;
	minify?: boolean;
}

export interface JsonOutput {
	result: string;
	valid: boolean;
}

// ============================================
// YAML Service Types
// ============================================
export interface YamlToJsonInput {
	yaml: string;
	indent?: number;
}

export interface JsonToYamlInput {
	json: string;
	indent?: number;
}

export interface YamlOutput {
	result: string;
}

// ============================================
// ENV Service Types
// ============================================
export interface EnvToJsonInput {
	env: string;
}

export interface JsonToEnvInput {
	json: string;
}

export interface EnvOutput {
	result: string;
}

// ============================================
// SQL Service Types
// ============================================
export type SqlDialect =
	| "sql"
	| "mysql"
	| "postgresql"
	| "sqlite"
	| "bigquery"
	| "redshift";

export interface SqlFormatInput {
	sql: string;
	dialect?: SqlDialect;
	indent?: number;
	uppercase?: boolean;
}

export interface SqlOutput {
	result: string;
}

// ============================================
// UUID Service Types
// ============================================
export type UuidVersion = "v4" | "v7";

export interface UuidGenerateInput {
	version?: UuidVersion;
	count?: number;
}

export interface UuidOutput {
	uuids: string[];
}

// ============================================
// Hash Service Types
// ============================================
export type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export interface HashGenerateInput {
	text: string;
	algorithm?: HashAlgorithm;
	allAlgorithms?: boolean;
}

export interface HashOutput {
	hashes: Record<string, string>;
}

// ============================================
// Password Service Types
// ============================================
export interface PasswordGenerateInput {
	length?: number;
	count?: number;
	uppercase?: boolean;
	lowercase?: boolean;
	numbers?: boolean;
	symbols?: boolean;
	excludeAmbiguous?: boolean;
}

export interface PasswordOutput {
	passwords: string[];
	strength: "weak" | "medium" | "strong" | "very-strong";
}

// ============================================
// Lorem Service Types
// ============================================
export type LoremType = "words" | "sentences" | "paragraphs";

export interface LoremGenerateInput {
	type?: LoremType;
	count?: number;
}

export interface LoremOutput {
	result: string;
}

// ============================================
// Timestamp Service Types
// ============================================
export interface TimestampToDateInput {
	timestamp: number;
	milliseconds?: boolean;
}

export interface DateToTimestampInput {
	date: string; // ISO 8601 format
	milliseconds?: boolean;
}

export interface TimestampOutput {
	timestamp?: number;
	iso?: string;
	utc?: string;
	local?: string;
	relative?: string;
}

// ============================================
// Base Convert Service Types
// ============================================
export type NumberBase = 2 | 8 | 10 | 16;

export interface BaseConvertInput {
	value: string;
	fromBase: NumberBase;
	toBase?: NumberBase; // If not provided, return all bases
}

export interface BaseConvertOutput {
	binary: string;
	octal: string;
	decimal: string;
	hex: string;
}

// ============================================
// Color Service Types
// ============================================
export type ColorFormat = "hex" | "rgb" | "hsl" | "hsv";

export interface ColorConvertInput {
	color: string;
	fromFormat?: ColorFormat; // Auto-detect if not provided
}

export interface ColorOutput {
	hex: string;
	rgb: { r: number; g: number; b: number };
	hsl: { h: number; s: number; l: number };
	hsv: { h: number; s: number; v: number };
	css: {
		hex: string;
		rgb: string;
		hsl: string;
	};
}

// ============================================
// Cron Service Types
// ============================================
export interface CronParseInput {
	expression: string;
}

export interface CronOutput {
	description: string;
	nextRuns: string[];
	isValid: boolean;
	parts?: {
		minute: string;
		hour: string;
		dayOfMonth: string;
		month: string;
		dayOfWeek: string;
	};
}

// ============================================
// JWT Service Types
// ============================================
export interface JwtDecodeInput {
	token: string;
}

export interface JwtOutput {
	header: Record<string, unknown>;
	payload: Record<string, unknown>;
	signature: string;
	isExpired?: boolean;
	expiresAt?: string;
}

// ============================================
// QR Code Service Types
// ============================================
export type QrFormat = "svg" | "png" | "base64";
export type QrErrorCorrection = "L" | "M" | "Q" | "H";

export interface QrGenerateInput {
	text: string;
	format?: QrFormat;
	size?: number;
	errorCorrection?: QrErrorCorrection;
	darkColor?: string;
	lightColor?: string;
}

export interface QrOutput {
	data: string; // SVG string, base64, or binary depending on format
	format: QrFormat;
}

// ============================================
// Diff Service Types
// ============================================
export type DiffMode = "chars" | "words" | "lines";

export interface DiffCompareInput {
	text1: string;
	text2: string;
	mode?: DiffMode;
}

export interface DiffSegment {
	type: "equal" | "insert" | "delete";
	value: string;
}

export interface DiffOutput {
	segments: DiffSegment[];
	stats: {
		additions: number;
		deletions: number;
		unchanged: number;
	};
}

// ============================================
// Regex Service Types
// ============================================
export interface RegexTestInput {
	pattern: string;
	text: string;
	flags?: string;
}

export interface RegexMatch {
	match: string;
	index: number;
	groups?: Record<string, string>;
}

export interface RegexOutput {
	isValid: boolean;
	matches: RegexMatch[];
	matchCount: number;
}

// ============================================
// Markdown Service Types
// ============================================
export interface MarkdownRenderInput {
	markdown: string;
	sanitize?: boolean;
}

export interface MarkdownOutput {
	html: string;
}
