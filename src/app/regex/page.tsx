"use client";

import { useState, useMemo } from "react";

interface Match {
	match: string;
	index: number;
	groups?: Record<string, string>;
}

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
					// Prevent infinite loop on zero-length matches
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

			// Build highlighted text
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
		<div>
			<h1 className="font-mono text-2xl font-bold mb-6">Regex Tester</h1>

			<div className="mb-6">
				<label className="block text-sm text-muted mb-2">Pattern</label>
				<div className="flex gap-2">
					<div className="flex-1 flex items-center bg-card border border-border rounded-lg overflow-hidden">
						<span className="px-3 text-muted">/</span>
						<input
							type="text"
							value={pattern}
							onChange={(e) => setPattern(e.target.value)}
							placeholder="[a-z]+"
							className="flex-1 border-0 bg-transparent"
						/>
						<span className="px-3 text-muted">/</span>
					</div>
					<div className="flex gap-1">
						{["g", "i", "m", "s", "u"].map((flag) => (
							<button
								key={flag}
								onClick={() => toggleFlag(flag)}
								className={`w-10 h-10 rounded-lg font-mono text-sm transition-colors ${
									flags.includes(flag)
										? "bg-accent text-background"
										: "bg-card border border-border text-muted hover:text-foreground"
								}`}
								title={
									{
										g: "global",
										i: "case-insensitive",
										m: "multiline",
										s: "dotAll",
										u: "unicode",
									}[flag]
								}
							>
								{flag}
							</button>
						))}
					</div>
				</div>
			</div>

			{error && (
				<div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm font-mono">
					{error}
				</div>
			)}

			<div className="mb-6">
				<label className="block text-sm text-muted mb-2">Test String</label>
				<textarea
					value={testString}
					onChange={(e) => setTestString(e.target.value)}
					placeholder="Enter text to test against..."
					className="w-full h-40 font-mono text-sm"
				/>
			</div>

			{highlightedText && highlightedText.length > 0 && (
				<div className="mb-6">
					<label className="block text-sm text-muted mb-2">
						Highlighted Matches ({matches.length} found)
					</label>
					<div className="p-4 rounded-lg bg-card border border-border font-mono text-sm whitespace-pre-wrap break-all">
						{highlightedText.map((part, i) =>
							part.isMatch ? (
								<span key={i} className="bg-accent/30 text-accent rounded px-0.5">
									{part.text}
								</span>
							) : (
								<span key={i}>{part.text}</span>
							)
						)}
					</div>
				</div>
			)}

			{matches.length > 0 && (
				<div>
					<label className="block text-sm text-muted mb-2">Match Details</label>
					<div className="space-y-2">
						{matches.map((m, i) => (
							<div
								key={i}
								className="p-3 rounded-lg bg-card border border-border font-mono text-sm"
							>
								<div className="flex items-center gap-4">
									<span className="text-muted">#{i + 1}</span>
									<span className="text-accent">{m.match}</span>
									<span className="text-muted text-xs">index: {m.index}</span>
								</div>
								{m.groups && Object.keys(m.groups).length > 0 && (
									<div className="mt-2 text-xs text-muted">
										Groups: {JSON.stringify(m.groups)}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
