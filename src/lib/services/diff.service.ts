import DiffMatchPatch from "diff-match-patch";
import {
	type DiffCompareInput,
	type DiffOutput,
	type DiffSegment,
	type Result,
	ok,
} from "./types";

/**
 * Compare two texts and return diff segments
 */
export function compareDiff(input: DiffCompareInput): Result<DiffOutput> {
	const dmp = new DiffMatchPatch();
	const diffs = dmp.diff_main(input.text1, input.text2);

	// Clean up the diff for better readability
	dmp.diff_cleanupSemantic(diffs);

	// Convert to our segment format
	const segments: DiffSegment[] = diffs.map(([type, value]) => ({
		type: type === 0 ? "equal" : type === 1 ? "insert" : "delete",
		value,
	}));

	// Calculate stats
	const stats = {
		additions: 0,
		deletions: 0,
		unchanged: 0,
	};

	for (const [type, text] of diffs) {
		if (type === -1) stats.deletions += text.length;
		else if (type === 1) stats.additions += text.length;
		else stats.unchanged += text.length;
	}

	return ok({ segments, stats });
}
