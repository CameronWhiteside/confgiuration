"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyIconButton } from "@/components/ui/copy-button";
import { AlertCircle, Clock, ArrowRight } from "lucide-react";

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

	const setNow = () => {
		setUnixInput(String(currentTime));
	};

	return (
		<ToolLayout toolId="timestamp">
			<div className="space-y-6">
				{/* Current Time */}
				<Card hover={false} gradient>
					<div className="flex items-center gap-4">
						<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-pink/20">
							<Clock className="w-6 h-6 text-primary" />
						</div>
						<div className="flex-1">
							<div className="text-sm text-foreground-muted mb-1">Current Unix Timestamp</div>
							<div className="flex items-center gap-4">
								<code className="text-2xl font-mono font-bold text-foreground">
									{currentTime}
								</code>
								<CopyIconButton text={String(currentTime)} />
							</div>
							<div className="text-sm text-foreground-muted mt-1">
								{new Date(currentTime * 1000).toLocaleString()}
							</div>
						</div>
					</div>
				</Card>

				{/* Error Display */}
				{error && (
					<Card hover={false} className="bg-error-bg border-error/20 p-4">
						<div className="flex items-center gap-3 text-error">
							<AlertCircle className="w-5 h-5 flex-shrink-0" />
							<code className="text-sm">{error}</code>
						</div>
					</Card>
				)}

				{/* Converters Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Unix to Date */}
					<Card hover={false}>
						<h3 className="font-mono text-lg font-semibold mb-4 flex items-center gap-2">
							Unix <ArrowRight className="w-4 h-4 text-foreground-muted" /> Date
						</h3>
						<div className="space-y-4">
							<div className="flex gap-2">
								<div className="flex-1">
									<Input
										value={unixInput}
										onChange={(e) => setUnixInput(e.target.value)}
										placeholder="1704067200"
									/>
								</div>
								<Button variant="secondary" onClick={setNow}>
									Now
								</Button>
							</div>
							<Button onClick={convertFromUnix} disabled={!unixInput} className="w-full">
								Convert
							</Button>
							{convertedFromUnix && (
								<div className="space-y-2">
									<div className="bg-background-secondary rounded-lg p-3 font-mono text-sm flex items-center justify-between">
										<span>{convertedFromUnix}</span>
										<CopyIconButton text={convertedFromUnix} />
									</div>
									<div className="text-sm text-foreground-muted">
										{new Date(convertedFromUnix).toLocaleString()}
									</div>
								</div>
							)}
						</div>
					</Card>

					{/* Date to Unix */}
					<Card hover={false}>
						<h3 className="font-mono text-lg font-semibold mb-4 flex items-center gap-2">
							Date <ArrowRight className="w-4 h-4 text-foreground-muted" /> Unix
						</h3>
						<div className="space-y-4">
							<Input
								value={dateInput}
								onChange={(e) => setDateInput(e.target.value)}
								placeholder="2024-01-01T00:00:00Z"
							/>
							<Button onClick={convertFromDate} disabled={!dateInput} className="w-full">
								Convert
							</Button>
							{convertedFromDate !== null && (
								<div className="bg-background-secondary rounded-lg p-3 font-mono text-sm flex items-center justify-between">
									<span>{convertedFromDate}</span>
									<CopyIconButton text={String(convertedFromDate)} />
								</div>
							)}
						</div>
					</Card>
				</div>

				<p className="text-sm text-foreground-muted text-center">
					Accepts timestamps in seconds or milliseconds. Date strings can be ISO 8601 or other parseable formats.
				</p>
			</div>
		</ToolLayout>
	);
}
