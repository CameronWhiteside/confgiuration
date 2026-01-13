import {
	type TimestampToDateInput,
	type DateToTimestampInput,
	type TimestampOutput,
	type Result,
	ok,
	err,
} from "./types";

/**
 * Convert Unix timestamp to date information
 */
export function timestampToDate(input: TimestampToDateInput): Result<TimestampOutput> {
	try {
		const timestamp = input.timestamp;

		// Auto-detect if timestamp is in seconds or milliseconds
		// Timestamps before 9999999999 (Nov 2286) are assumed to be seconds
		const isMilliseconds = input.milliseconds ?? timestamp > 9999999999;
		const ms = isMilliseconds ? timestamp : timestamp * 1000;

		const date = new Date(ms);
		if (isNaN(date.getTime())) {
			return err("Invalid timestamp");
		}

		// Calculate relative time
		const now = Date.now();
		const diffMs = now - ms;
		const diffSecs = Math.abs(Math.floor(diffMs / 1000));
		const diffMins = Math.floor(diffSecs / 60);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		let relative: string;
		if (diffMs < 0) {
			// Future
			if (diffDays > 365) relative = `in ${Math.floor(-diffDays / 365)} years`;
			else if (diffDays > 30) relative = `in ${Math.floor(-diffDays / 30)} months`;
			else if (diffDays > 0) relative = `in ${-diffDays} days`;
			else if (diffHours > 0) relative = `in ${-diffHours} hours`;
			else if (diffMins > 0) relative = `in ${-diffMins} minutes`;
			else relative = "in a few seconds";
		} else {
			// Past
			if (diffDays > 365) relative = `${Math.floor(diffDays / 365)} years ago`;
			else if (diffDays > 30) relative = `${Math.floor(diffDays / 30)} months ago`;
			else if (diffDays > 0) relative = `${diffDays} days ago`;
			else if (diffHours > 0) relative = `${diffHours} hours ago`;
			else if (diffMins > 0) relative = `${diffMins} minutes ago`;
			else relative = "just now";
		}

		return ok({
			timestamp: isMilliseconds ? Math.floor(timestamp / 1000) : timestamp,
			iso: date.toISOString(),
			utc: date.toUTCString(),
			local: date.toLocaleString(),
			relative,
		});
	} catch (e) {
		return err(e instanceof Error ? e.message : "Conversion failed");
	}
}

/**
 * Convert date string to Unix timestamp
 */
export function dateToTimestamp(input: DateToTimestampInput): Result<TimestampOutput> {
	try {
		const date = new Date(input.date);
		if (isNaN(date.getTime())) {
			return err("Invalid date format");
		}

		const timestamp = input.milliseconds
			? date.getTime()
			: Math.floor(date.getTime() / 1000);

		return ok({
			timestamp,
			iso: date.toISOString(),
			utc: date.toUTCString(),
			local: date.toLocaleString(),
		});
	} catch (e) {
		return err(e instanceof Error ? e.message : "Conversion failed");
	}
}

/**
 * Get current timestamp
 */
export function getCurrentTimestamp(milliseconds?: boolean): Result<TimestampOutput> {
	const now = new Date();
	const timestamp = milliseconds ? now.getTime() : Math.floor(now.getTime() / 1000);

	return ok({
		timestamp,
		iso: now.toISOString(),
		utc: now.toUTCString(),
		local: now.toLocaleString(),
	});
}
