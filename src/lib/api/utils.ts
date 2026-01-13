/**
 * API Utilities
 *
 * Shared helpers for all API routes.
 * Provides consistent response format for REST API endpoints.
 */

// Standard success response
export function jsonResponse<T>(data: T, status = 200): Response {
	return Response.json({ success: true, data }, { status });
}

// Standard error response
export function errorResponse(error: string, status = 400): Response {
	return Response.json({ success: false, error }, { status });
}

// Parse JSON body with error handling
export async function parseBody<T>(req: Request): Promise<T | null> {
	try {
		return await req.json();
	} catch {
		return null;
	}
}

// Parse URL search params to object
export function parseSearchParams<T extends Record<string, string | number | boolean>>(
	url: string,
	defaults: T
): T {
	const searchParams = new URL(url).searchParams;
	const result = { ...defaults };

	for (const key in defaults) {
		const value = searchParams.get(key);
		if (value !== null) {
			const defaultValue = defaults[key];
			if (typeof defaultValue === "number") {
				result[key] = Number(value) as T[typeof key];
			} else if (typeof defaultValue === "boolean") {
				result[key] = (value === "true") as T[typeof key];
			} else {
				result[key] = value as T[typeof key];
			}
		}
	}

	return result;
}

// CORS headers for API responses (useful for external API consumers)
export const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

// OPTIONS handler for CORS preflight
export function handleOptions(): Response {
	return new Response(null, {
		status: 204,
		headers: corsHeaders,
	});
}
