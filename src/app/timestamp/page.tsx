import { timestampToDate, dateToTimestamp } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { TimestampForm } from "./form";

interface PageProps {
	searchParams: Promise<{
		mode?: string;
		unix?: string;
		date?: string;
	}>;
}

export default async function TimestampPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const mode = params.mode || "";
	const unixInput = params.unix || "";
	const dateInput = params.date || "";

	// Process on server if input provided
	let convertedFromUnix: string | null = null;
	let convertedFromDate: number | null = null;
	let error: string | null = null;

	if (mode === "toDate" && unixInput) {
		const timestamp = parseInt(unixInput, 10);
		if (!isNaN(timestamp)) {
			const result = timestampToDate({ timestamp });
			if (result.success && result.data.iso) {
				convertedFromUnix = result.data.iso;
			} else if (!result.success) {
				error = result.error;
			}
		} else {
			error = "Invalid timestamp";
		}
	}

	if (mode === "fromDate" && dateInput) {
		const result = dateToTimestamp({ date: dateInput });
		if (result.success && result.data.timestamp !== undefined) {
			convertedFromDate = result.data.timestamp;
		} else if (!result.success) {
			error = result.error;
		}
	}

	return (
		<ToolLayout toolId="timestamp">
			<TimestampForm
				initialUnixInput={unixInput}
				initialDateInput={dateInput}
				initialConvertedFromUnix={convertedFromUnix}
				initialConvertedFromDate={convertedFromDate}
				initialError={error}
			/>
		</ToolLayout>
	);
}
