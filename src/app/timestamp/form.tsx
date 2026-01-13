"use client";

import { useState, useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyIconButton } from "@/components/ui/copy-button";
import { AlertCircle, Clock, ArrowRight } from "lucide-react";

interface TimestampFormProps {
	initialUnixInput: string;
	initialDateInput: string;
	initialConvertedFromUnix: string | null;
	initialConvertedFromDate: number | null;
	initialError: string | null;
}

export function TimestampForm({
	initialUnixInput,
	initialDateInput,
	initialConvertedFromUnix,
	initialConvertedFromDate,
	initialError,
}: TimestampFormProps) {
	const [unixInput, setUnixInput] = useState(initialUnixInput);
	const [dateInput, setDateInput] = useState(initialDateInput);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [convertedFromUnix, setConvertedFromUnix] = useState<string | null>(
		initialConvertedFromUnix
	);
	const [convertedFromDate, setConvertedFromDate] = useState<number | null>(
		initialConvertedFromDate
	);
	const [error, setError] = useState(initialError || "");
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setCurrentTime(Math.floor(Date.now() / 1000));
		const interval = setInterval(() => {
			setCurrentTime(Math.floor(Date.now() / 1000));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const convertFromUnix = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setConvertedFromUnix(null);

		startTransition(async () => {
			try {
				const res = await fetch("/api/timestamp/to-date", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ timestamp: parseInt(unixInput, 10) }),
				});

				const data = await res.json() as { success: boolean; data?: { iso: string }; error?: string };

				if (data.success && data.data) {
					setConvertedFromUnix(data.data.iso);
					setError("");
				} else {
					setError(data.error || "Conversion failed");
				}
			} catch {
				setError("Conversion failed");
			}
		});
	};

	const convertFromDate = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setConvertedFromDate(null);

		startTransition(async () => {
			try {
				const res = await fetch("/api/timestamp/from-date", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ date: dateInput }),
				});

				const data = await res.json() as { success: boolean; data?: { timestamp: number }; error?: string };

				if (data.success && data.data) {
					setConvertedFromDate(data.data.timestamp);
					setError("");
				} else {
					setError(data.error || "Conversion failed");
				}
			} catch {
				setError("Conversion failed");
			}
		});
	};

	const setNow = () => {
		setUnixInput(String(currentTime));
	};

	return (
		<div className="space-y-6">
			{/* Current Time */}
			<Card hover={false} gradient>
				<div className="flex items-center gap-4">
					<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-pink/20">
						<Clock className="w-6 h-6 text-primary" />
					</div>
					<div className="flex-1">
						<div className="text-sm text-foreground-muted mb-1">
							Current Unix Timestamp
						</div>
						<div className="flex items-center gap-4">
							<code className="text-2xl font-mono font-bold text-foreground">
								{currentTime}
							</code>
							<CopyIconButton text={String(currentTime)} />
						</div>
						<div className="text-sm text-foreground-muted mt-1">
							{currentTime > 0 && new Date(currentTime * 1000).toLocaleString()}
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
					<form
						onSubmit={convertFromUnix}
						method="GET"
						action="/timestamp"
						className="space-y-4"
					>
						<input type="hidden" name="mode" value="toDate" />
						<div className="flex gap-2">
							<div className="flex-1">
								<Input
									name="unix"
									value={unixInput}
									onChange={(e) => setUnixInput(e.target.value)}
									placeholder="1704067200"
								/>
							</div>
							<Button type="button" variant="secondary" onClick={setNow}>
								Now
							</Button>
						</div>
						<Button type="submit" disabled={!unixInput || isPending} className="w-full">
							{isPending ? "Converting..." : "Convert"}
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
					</form>
				</Card>

				{/* Date to Unix */}
				<Card hover={false}>
					<h3 className="font-mono text-lg font-semibold mb-4 flex items-center gap-2">
						Date <ArrowRight className="w-4 h-4 text-foreground-muted" /> Unix
					</h3>
					<form
						onSubmit={convertFromDate}
						method="GET"
						action="/timestamp"
						className="space-y-4"
					>
						<input type="hidden" name="mode" value="fromDate" />
						<Input
							name="date"
							value={dateInput}
							onChange={(e) => setDateInput(e.target.value)}
							placeholder="2024-01-01T00:00:00Z"
						/>
						<Button type="submit" disabled={!dateInput || isPending} className="w-full">
							{isPending ? "Converting..." : "Convert"}
						</Button>
						{convertedFromDate !== null && (
							<div className="bg-background-secondary rounded-lg p-3 font-mono text-sm flex items-center justify-between">
								<span>{convertedFromDate}</span>
								<CopyIconButton text={String(convertedFromDate)} />
							</div>
						)}
					</form>
				</Card>
			</div>

			<p className="text-sm text-foreground-muted text-center">
				Accepts timestamps in seconds or milliseconds. Date strings can be ISO 8601
				or other parseable formats.
			</p>
		</div>
	);
}
