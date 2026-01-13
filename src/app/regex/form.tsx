"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Match {
	match: string;
	index: number;
	groups?: Record<string, string>;
}

const FLAGS = [
	{ flag: "g", name: "global", description: "Find all matches" },
	{ flag: "i", name: "case-insensitive", description: "Ignore case" },
	{ flag: "m", name: "multiline", description: "^ and $ match line boundaries" },
	{ flag: "s", name: "dotAll", description: ". matches newlines" },
	{ flag: "u", name: "unicode", description: "Unicode support" },
];

interface RegexFormProps {
	initialPattern: string;
	initialFlags: string;
	initialText: string;
	initialMatches: Match[];
	initialError: string | null;
}

export function RegexForm({
	initialPattern,
	initialFlags,
	initialText,
	initialMatches,
	initialError,
}: RegexFormProps) {
	const [pattern, setPattern] = useState(initialPattern);
	const [flags, setFlags] = useState(initialFlags);
	const [testString, setTestString] = useState(initialText);
	const [matches, setMatches] = useState<Match[]>(initialMatches);
	const [error, setError] = useState(initialError || "");
	const [isPending, startTransition] = useTransition();

	const runTest = (newPattern: string, newFlags: string, newText: string) => {
		if (!newPattern || !newText) {
			setMatches([]);
			setError("");
			return;
		}

		startTransition(async () => {
			try {
				const res = await fetch("/api/regex/test", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						pattern: newPattern,
						flags: newFlags,
						text: newText,
					}),
				});

				const data = await res.json() as { success: boolean; data?: { matches: Match[] }; error?: string };

				if (data.success && data.data) {
					setMatches(data.data.matches);
					setError("");
				} else {
					setError(data.error || "Test failed");
					setMatches([]);
				}
			} catch {
				setError("Request failed");
				setMatches([]);
			}
		});
	};

	const handlePatternChange = (value: string) => {
		setPattern(value);
		runTest(value, flags, testString);
	};

	const handleTextChange = (value: string) => {
		setTestString(value);
		runTest(pattern, flags, value);
	};

	const toggleFlag = (flag: string) => {
		const newFlags = flags.includes(flag)
			? flags.replace(flag, "")
			: flags + flag;
		setFlags(newFlags);
		runTest(pattern, newFlags, testString);
	};

	// Generate highlighted text for display
	const highlightedText = (() => {
		if (!matches.length || !testString) return null;

		let lastIndex = 0;
		const parts: { text: string; isMatch: boolean }[] = [];

		for (const m of matches) {
			if (m.index > lastIndex) {
				parts.push({ text: testString.slice(lastIndex, m.index), isMatch: false });
			}
			parts.push({ text: m.match, isMatch: true });
			lastIndex = m.index + m.match.length;
		}

		if (lastIndex < testString.length) {
			parts.push({ text: testString.slice(lastIndex), isMatch: false });
		}

		return parts;
	})();

	return (
		<div className="space-y-6">
			{/* Pattern Input */}
			<form method="GET" action="/regex">
				<input type="hidden" name="flags" value={flags} />

				<div>
					<label className="block text-sm font-medium text-foreground-muted mb-2">
						Pattern
					</label>
					<div className="flex gap-2">
						<div className="flex-1 flex items-center bg-card border border-border rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
							<span className="px-3 text-foreground-muted font-mono">/</span>
							<input
								type="text"
								name="pattern"
								value={pattern}
								onChange={(e) => handlePatternChange(e.target.value)}
								placeholder="[a-z]+"
								className="flex-1 py-2.5 bg-transparent border-0 text-sm font-mono text-foreground focus:outline-none placeholder:text-foreground-muted/60"
							/>
							<span className="px-3 text-foreground-muted font-mono">/</span>
						</div>
						<div className="flex gap-1">
							{FLAGS.map(({ flag, name }) => (
								<button
									key={flag}
									type="button"
									onClick={() => toggleFlag(flag)}
									title={name}
									className={cn(
										"w-10 h-10 rounded-lg font-mono text-sm transition-colors",
										flags.includes(flag)
											? "bg-gradient-to-r from-accent-purple to-accent-pink text-white"
											: "bg-card border border-border text-foreground-muted hover:text-foreground hover:border-border-hover"
									)}
								>
									{flag}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Test String */}
				<div className="mt-6">
					<Textarea
						label="Test String"
						name="text"
						value={testString}
						onChange={(e) => handleTextChange(e.target.value)}
						placeholder="Enter text to test against..."
						className="min-h-[120px]"
					/>
				</div>

				<noscript>
					<button
						type="submit"
						className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
					>
						Test
					</button>
				</noscript>
			</form>

			{/* Error Display */}
			{error && (
				<Card hover={false} className="bg-error-bg border-error/20 p-4">
					<div className="flex items-center gap-3 text-error">
						<AlertCircle className="w-5 h-5 flex-shrink-0" />
						<code className="text-sm">{error}</code>
					</div>
				</Card>
			)}

			{/* Highlighted Matches */}
			{highlightedText && highlightedText.length > 0 && (
				<Card hover={false}>
					<div className="flex items-center justify-between mb-3">
						<h3 className="font-mono text-sm font-medium text-foreground-muted uppercase tracking-wider">
							Highlighted Matches
						</h3>
						<span className="flex items-center gap-2 text-sm text-success">
							<CheckCircle className="w-4 h-4" />
							{matches.length} {matches.length === 1 ? "match" : "matches"}
						</span>
					</div>
					<div className="bg-background-secondary rounded-lg p-4 font-mono text-sm whitespace-pre-wrap break-all">
						{highlightedText.map((part, i) =>
							part.isMatch ? (
								<span
									key={i}
									className="bg-primary/20 text-primary rounded px-0.5"
								>
									{part.text}
								</span>
							) : (
								<span key={i}>{part.text}</span>
							)
						)}
					</div>
				</Card>
			)}

			{/* Match Details */}
			{matches.length > 0 && (
				<Card hover={false}>
					<h3 className="font-mono text-sm font-medium text-foreground-muted uppercase tracking-wider mb-3">
						Match Details
					</h3>
					<div className="space-y-2">
						{matches.map((m, i) => (
							<div
								key={i}
								className="bg-background-secondary rounded-lg p-3 font-mono text-sm"
							>
								<div className="flex items-center gap-4">
									<span className="text-foreground-muted">#{i + 1}</span>
									<span className="text-primary font-medium">{m.match}</span>
									<span className="text-foreground-muted text-xs">
										index: {m.index}
									</span>
								</div>
								{m.groups && Object.keys(m.groups).length > 0 && (
									<div className="mt-2 text-xs text-foreground-muted">
										Groups: {JSON.stringify(m.groups)}
									</div>
								)}
							</div>
						))}
					</div>
				</Card>
			)}
		</div>
	);
}
