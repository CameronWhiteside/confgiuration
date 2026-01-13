import { format } from "sql-formatter";
import {
	type SqlFormatInput,
	type SqlOutput,
	type Result,
	ok,
	err,
} from "./types";

/**
 * Format SQL query
 */
export function formatSql(input: SqlFormatInput): Result<SqlOutput> {
	try {
		const result = format(input.sql, {
			language: input.dialect ?? "sql",
			tabWidth: input.indent ?? 2,
			keywordCase: input.uppercase !== false ? "upper" : "lower",
			linesBetweenQueries: 2,
		});
		return ok({ result });
	} catch (e) {
		return err(e instanceof Error ? e.message : "Failed to format SQL");
	}
}

/**
 * Minify SQL query (remove extra whitespace)
 */
export function minifySql(sql: string): Result<SqlOutput> {
	try {
		const result = sql
			.replace(/\s+/g, " ")
			.replace(/\s*([,()])\s*/g, "$1")
			.trim();
		return ok({ result });
	} catch (e) {
		return err(e instanceof Error ? e.message : "Failed to minify SQL");
	}
}
