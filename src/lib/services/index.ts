/**
 * Services Layer
 *
 * Pure functions for all tool computations.
 * Used by:
 * - SSR pages (server-side form processing)
 * - REST API endpoints
 * - Future MCP server
 */

// Types
export * from "./types";

// Encoding Services
export { encodeBase64, decodeBase64 } from "./base64.service";
export { encodeUrl, decodeUrl } from "./url.service";
export { decodeJwt } from "./jwt.service";
export { generateQr, generateQrBuffer } from "./qr.service";
export { convertBase } from "./base.service";

// Data Format Services
export { formatJson, validateJson } from "./json.service";
export { yamlToJson, jsonToYaml } from "./yaml.service";
export { envToJson, jsonToEnv } from "./env.service";
export { formatSql, minifySql } from "./sql.service";

// Generator Services
export { generateUuid } from "./uuid.service";
export { generateHash } from "./hash.service";
export { generateLorem } from "./lorem.service";
export { generatePassword } from "./password.service";

// Text Tool Services
export { compareDiff } from "./diff.service";
export { testRegex, validateRegex } from "./regex.service";
export { renderMarkdown } from "./markdown.service";
export { parseCron } from "./cron.service";

// Utility Services
export { timestampToDate, dateToTimestamp, getCurrentTimestamp } from "./timestamp.service";
export { convertColor } from "./color.service";
