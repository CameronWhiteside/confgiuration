import YAML from "yaml";
import {
	type YamlToJsonInput,
	type JsonToYamlInput,
	type YamlOutput,
	type Result,
	ok,
	err,
} from "./types";

/**
 * Convert YAML to JSON
 */
export function yamlToJson(input: YamlToJsonInput): Result<YamlOutput> {
	try {
		const parsed = YAML.parse(input.yaml);
		const result = JSON.stringify(parsed, null, input.indent ?? 2);
		return ok({ result });
	} catch (e) {
		return err(e instanceof Error ? e.message : "Invalid YAML");
	}
}

/**
 * Convert JSON to YAML
 */
export function jsonToYaml(input: JsonToYamlInput): Result<YamlOutput> {
	try {
		const parsed = JSON.parse(input.json);
		const result = YAML.stringify(parsed, { indent: input.indent ?? 2 });
		return ok({ result });
	} catch (e) {
		return err(e instanceof Error ? e.message : "Invalid JSON");
	}
}
