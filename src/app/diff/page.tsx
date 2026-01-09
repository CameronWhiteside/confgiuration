"use client";

import { useState } from "react";
import DiffMatchPatch from "diff-match-patch";

export default function DiffPage() {
	const [textA, setTextA] = useState("");
	const [textB, setTextB] = useState("");
	const [diff, setDiff] = useState<[number, string][]>([]);

	const compare = () => {
		const dmp = new DiffMatchPatch();
		const diffs = dmp.diff_main(textA, textB);
		dmp.diff_cleanupSemantic(diffs);
		setDiff(diffs);
	};

	return (
		<div>
			<h1 className="font-mono text-2xl font-bold mb-6">Text Diff</h1>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<div>
					<label className="block text-sm text-muted mb-2">Original</label>
					<textarea
						value={textA}
						onChange={(e) => setTextA(e.target.value)}
						placeholder="Enter original text..."
						className="w-full h-64 font-mono text-sm"
					/>
				</div>

				<div>
					<label className="block text-sm text-muted mb-2">Modified</label>
					<textarea
						value={textB}
						onChange={(e) => setTextB(e.target.value)}
						placeholder="Enter modified text..."
						className="w-full h-64 font-mono text-sm"
					/>
				</div>
			</div>

			<button
				onClick={compare}
				disabled={!textA && !textB}
				className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-accent-hover disabled:opacity-50 mb-6"
			>
				Compare
			</button>

			{diff.length > 0 && (
				<div>
					<label className="block text-sm text-muted mb-2">Diff Result</label>
					<div className="p-4 rounded-lg bg-card border border-border font-mono text-sm whitespace-pre-wrap break-all">
						{diff.map(([type, text], i) => {
							if (type === 0) {
								// Equal
								return <span key={i}>{text}</span>;
							} else if (type === -1) {
								// Deletion
								return (
									<span
										key={i}
										className="bg-error/30 text-error line-through"
									>
										{text}
									</span>
								);
							} else {
								// Addition
								return (
									<span key={i} className="bg-success/30 text-success">
										{text}
									</span>
								);
							}
						})}
					</div>
				</div>
			)}

			{diff.length === 0 && textA === "" && textB === "" && (
				<div className="text-center py-16 text-muted">
					Enter text in both fields and click Compare
				</div>
			)}
		</div>
	);
}
