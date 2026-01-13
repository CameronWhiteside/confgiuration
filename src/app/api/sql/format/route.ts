import { formatSql, type SqlDialect } from "@/lib/services";
import { jsonResponse, errorResponse, parseBody, handleOptions } from "@/lib/api/utils";

export async function OPTIONS() {
	return handleOptions();
}

interface SqlFormatBody {
	sql: string;
	dialect?: SqlDialect;
	indent?: number;
	uppercase?: boolean;
}

export async function POST(req: Request) {
	const body = await parseBody<SqlFormatBody>(req);

	if (!body?.sql && body?.sql !== "") {
		return errorResponse("sql is required", 400);
	}

	const result = formatSql({
		sql: body.sql,
		dialect: body.dialect,
		indent: body.indent,
		uppercase: body.uppercase,
	});

	if (!result.success) {
		return errorResponse(result.error, 400);
	}

	return jsonResponse(result.data);
}
