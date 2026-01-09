"use client";

import { useState, useEffect } from "react";

export default function TimestampPage() {
	const [unixInput, setUnixInput] = useState("");
	const [dateInput, setDateInput] = useState("");
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [convertedFromUnix, setConvertedFromUnix] = useState<string | null>(null);
	const [convertedFromDate, setConvertedFromDate] = useState<number | null>(null);
	const [error, setError] = useState("");

	useEffect(() => {
		setCurrentTime(Math.floor(Date.now() / 1000));
		const interval = setInterval(() => {
			setCurrentTime(Math.floor(Date.now() / 1000));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const convertFromUnix = () => {
		setError("");
		setConvertedFromUnix(null);
		try {
			const timestamp = parseInt(unixInput, 10);
			if (isNaN(timestamp)) {
				throw new Error("Invalid timestamp");
			}
			// Handle both seconds and milliseconds
			const ms = timestamp > 9999999999 ? timestamp : timestamp * 1000;
			const date = new Date(ms);
			if (isNaN(date.getTime())) {
				throw new Error("Invalid timestamp");
			}
			setConvertedFromUnix(date.toISOString());
		} catch (e) {
			setError(e instanceof Error ? e.message : "Conversion failed");
		}
	};

	const convertFromDate = () => {
		setError("");
		setConvertedFromDate(null);
		try {
			const date = new Date(dateInput);
			if (isNaN(date.getTime())) {
				throw new Error("Invalid date format");
			}
			setConvertedFromDate(Math.floor(date.getTime() / 1000));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Conversion failed");
		}
	};

	const copy = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	const setNow = () => {
		setUnixInput(String(currentTime));
	};

	return (
		<div>
			<h1 className="font-mono text-2xl font-bold mb-6">Unix Timestamp</h1>

			{/* Current time */}
			<div className="mb-8 p-4 rounded-lg bg-card border border-border">
				<div className="text-sm text-muted mb-1">Current Unix Timestamp</div>
				<div className="flex items-center gap-4">
					<code className="text-2xl font-mono">{currentTime}</code>
					<button
						onClick={() => copy(String(currentTime))}
						className="px-3 py-1 text-sm bg-background border border-border rounded hover:bg-card-hover"
					>
						Copy
					</button>
				</div>
				<div className="text-sm text-muted mt-2">
					{new Date(currentTime * 1000).toLocaleString()}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Unix to Date */}
				<div className="p-4 rounded-lg bg-card border border-border">
					<h2 className="font-medium mb-4">Unix → Date</h2>
					<div className="flex gap-2 mb-4">
						<input
							type="text"
							value={unixInput}
							onChange={(e) => setUnixInput(e.target.value)}
							placeholder="1704067200"
							className="flex-1"
						/>
						<button
							onClick={setNow}
							className="px-3 py-2 text-sm bg-background border border-border rounded hover:bg-card-hover"
						>
							Now
						</button>
					</div>
					<button
						onClick={convertFromUnix}
						disabled={!unixInput}
						className="w-full px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-accent-hover disabled:opacity-50 mb-4"
					>
						Convert
					</button>
					{convertedFromUnix && (
						<div className="space-y-2">
							<div className="p-3 rounded bg-background font-mono text-sm">
								{convertedFromUnix}
							</div>
							<div className="text-sm text-muted">
								{new Date(convertedFromUnix).toLocaleString()}
							</div>
						</div>
					)}
				</div>

				{/* Date to Unix */}
				<div className="p-4 rounded-lg bg-card border border-border">
					<h2 className="font-medium mb-4">Date → Unix</h2>
					<input
						type="text"
						value={dateInput}
						onChange={(e) => setDateInput(e.target.value)}
						placeholder="2024-01-01T00:00:00Z"
						className="w-full mb-4"
					/>
					<button
						onClick={convertFromDate}
						disabled={!dateInput}
						className="w-full px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-accent-hover disabled:opacity-50 mb-4"
					>
						Convert
					</button>
					{convertedFromDate !== null && (
						<div className="flex items-center gap-2">
							<div className="flex-1 p-3 rounded bg-background font-mono text-sm">
								{convertedFromDate}
							</div>
							<button
								onClick={() => copy(String(convertedFromDate))}
								className="px-3 py-2 text-sm bg-background border border-border rounded hover:bg-card-hover"
							>
								Copy
							</button>
						</div>
					)}
				</div>
			</div>

			{error && (
				<div className="mt-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm font-mono">
					{error}
				</div>
			)}

			<div className="mt-8 text-sm text-muted">
				<p>Accepts timestamps in seconds or milliseconds. Date strings can be ISO 8601 or other parseable formats.</p>
			</div>
		</div>
	);
}
