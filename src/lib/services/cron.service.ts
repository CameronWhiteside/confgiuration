import {
	type CronParseInput,
	type CronOutput,
	type Result,
	ok,
	err,
} from "./types";

interface CronParts {
	minute: string;
	hour: string;
	dayOfMonth: string;
	month: string;
	dayOfWeek: string;
}

const DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const MONTHS = [
	"",
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

function parseCronParts(cron: string): CronParts | null {
	const parts = cron.trim().split(/\s+/);
	if (parts.length !== 5) return null;

	return {
		minute: parts[0],
		hour: parts[1],
		dayOfMonth: parts[2],
		month: parts[3],
		dayOfWeek: parts[4],
	};
}

function explainPart(value: string, unit: string, names?: string[]): string {
	if (value === "*") return `every ${unit}`;
	if (value.includes("/")) {
		const [, step] = value.split("/");
		return `every ${step} ${unit}s`;
	}
	if (value.includes("-")) {
		const [start, end] = value.split("-");
		const startName = names ? names[parseInt(start)] || start : start;
		const endName = names ? names[parseInt(end)] || end : end;
		return `${startName} through ${endName}`;
	}
	if (value.includes(",")) {
		const vals = value.split(",");
		const namedVals = names ? vals.map((v) => names[parseInt(v)] || v) : vals;
		return namedVals.join(", ");
	}
	return names ? names[parseInt(value)] || value : value;
}

function explainCron(parts: CronParts): string {
	const explanations: string[] = [];

	// Minute
	if (parts.minute === "*") {
		explanations.push("every minute");
	} else if (parts.minute === "0") {
		explanations.push("at minute 0");
	} else {
		explanations.push(`at minute ${explainPart(parts.minute, "minute")}`);
	}

	// Hour
	if (parts.hour !== "*") {
		explanations.push(`past hour ${explainPart(parts.hour, "hour")}`);
	}

	// Day of Month
	if (parts.dayOfMonth !== "*") {
		explanations.push(`on day ${explainPart(parts.dayOfMonth, "day")} of the month`);
	}

	// Month
	if (parts.month !== "*") {
		explanations.push(`in ${explainPart(parts.month, "month", MONTHS)}`);
	}

	// Day of Week
	if (parts.dayOfWeek !== "*") {
		explanations.push(`on ${explainPart(parts.dayOfWeek, "day", DAYS)}`);
	}

	return explanations.join(" ");
}

/**
 * Calculate next run times for a cron expression
 */
function getNextRuns(parts: CronParts, count: number = 5): string[] {
	const runs: string[] = [];
	const now = new Date();

	// Simple implementation - just show placeholder for now
	// A full implementation would need a proper cron library
	// For SSR, we can compute this server-side later

	for (let i = 0; i < count; i++) {
		const nextRun = new Date(now);
		nextRun.setMinutes(nextRun.getMinutes() + (i + 1) * 60);
		runs.push(nextRun.toISOString());
	}

	return runs;
}

/**
 * Parse and explain a cron expression
 */
export function parseCron(input: CronParseInput): Result<CronOutput> {
	const parts = parseCronParts(input.expression);

	if (!parts) {
		return err("Invalid cron expression - must have exactly 5 fields");
	}

	const description = explainCron(parts);
	const nextRuns = getNextRuns(parts);

	return ok({
		description,
		nextRuns,
		isValid: true,
		parts,
	});
}
