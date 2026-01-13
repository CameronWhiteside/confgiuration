import { formatSql, type SqlDialect } from "@/lib/services";
import { ToolLayout } from "@/components/layout/tool-layout";
import { SqlForm } from "./form";

interface PageProps {
	searchParams: Promise<{
		input?: string;
		dialect?: string;
		indent?: string;
		uppercase?: string;
	}>;
}

const SAMPLE_SQL = `SELECT u.id, u.name, u.email, COUNT(o.id) as order_count, SUM(o.total) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at > '2024-01-01' AND u.status = 'active' GROUP BY u.id, u.name, u.email HAVING COUNT(o.id) > 0 ORDER BY total_spent DESC LIMIT 100;`;

export default async function SqlPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const input = params.input || SAMPLE_SQL;
	const dialect = (params.dialect || "sql") as SqlDialect;
	const indent = params.indent ? parseInt(params.indent) : 2;
	const uppercase = params.uppercase !== "false";

	let result: string | null = null;
	let error: string | null = null;

	if (params.input) {
		const serviceResult = formatSql({ sql: input, dialect, indent, uppercase });
		if (serviceResult.success) {
			result = serviceResult.data.result;
		} else {
			error = serviceResult.error;
		}
	}

	return (
		<ToolLayout toolId="sql">
			<SqlForm
				initialInput={input}
				initialOutput={result}
				initialError={error}
				initialDialect={dialect}
				initialIndent={indent}
				initialUppercase={uppercase}
			/>
		</ToolLayout>
	);
}
