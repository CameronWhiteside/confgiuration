"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
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

export default function RegexPage() {
	const [pattern, setPattern] = useState("");
	const [flags, setFlags] = useState("g");
	const [testString, setTestString] = useState("");
	const [error, setError] = useState("");

	const { matches, highlightedText } = useMemo(() => {
		if (!pattern || !testString) {
			return { matches: [], highlightedText: null };
		}

		try {
			const regex = new RegExp(pattern, flags);
			const matchList: Match[] = [];

			if (flags.includes("g")) {
				let match;
				while ((match = regex.exec(testString)) !== null) {
					matchList.push({
						match: match[0],
						index: match.index,
						groups: match.groups,
					});
					if (match[0].length === 0) {
						regex.lastIndex++;
					}
				}
			} else {
				const match = regex.exec(testString);
				if (match) {
					matchList.push({
						match: match[0],
						index: match.index,
						groups: match.groups,
					});
				}
			}

			let lastIndex = 0;
			const parts: { text: string; isMatch: boolean }[] = [];

			for (const m of matchList) {
				if (m.index > lastIndex) {
					parts.push({ text: testString.slice(lastIndex, m.index), isMatch: false });
				}
				parts.push({ text: m.match, isMatch: true });
				lastIndex = m.index + m.match.length;
			}

			if (lastIndex < testString.length) {
				parts.push({ text: testString.slice(lastIndex), isMatch: false });
			}

			setError("");
			return { matches: matchList, highlightedText: parts };
		} catch (e) {
			setError(e instanceof Error ? e.message : "Invalid regex");
			return { matches: [], highlightedText: null };
		}
	}, [pattern, flags, testString]);

	const toggleFlag = (flag: string) => {
		if (flags.includes(flag)) {
			setFlags(flags.replace(flag, ""));
		} else {
			setFlags(flags + flag);
		}
	};

	return (
		<ToolLayout toolId="regex">
			<div className="space-y-6">
				{/* Pattern Input */}
				<div>
					<label className="block text-sm font-medium text-foreground-muted mb-2">
						Pattern
					</label>
					<div className="flex gap-2">
						<div className="flex-1 flex items-center bg-card border border-border rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
							<span className="px-3 text-foreground-muted font-mono">/</span>
							<input
								type="text"
								value={pattern}
								onChange={(e) => setPattern(e.target.value)}
								placeholder="[a-z]+"
								className="flex-1 py-2.5 bg-transparent border-0 text-sm font-mono text-foreground focus:outline-none placeholder:text-foreground-muted/60"
							/>
							<span className="px-3 text-foreground-muted font-mono">/</span>
						</div>
						<div className="flex gap-1">
							{FLAGS.map(({ flag, name }) => (
								<button
									key={flag}
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

				{/* Error Display */}
				{error && (
					<Card hover={false} className="bg-error-bg border-error/20 p-4">
						<div className="flex items-center gap-3 text-error">
							<AlertCircle className="w-5 h-5 flex-shrink-0" />
							<code className="text-sm">{error}</code>
						</div>
					</Card>
				)}

				{/* Test String */}
				<Textarea
					label="Test String"
					value={testString}
					onChange={(e) => setTestString(e.target.value)}
					placeholder="Enter text to test against..."
					className="min-h-[120px]"
				/>

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
		</ToolLayout>
	);
}
