import Link from "next/link";

const tools = [
	{
		href: "/json",
		name: "JSON",
		description: "Format and validate JSON",
	},
	{
		href: "/env",
		name: "ENV",
		description: "Convert between ENV and JSON",
	},
	{
		href: "/base64",
		name: "Base64",
		description: "Encode and decode Base64",
	},
	{
		href: "/url",
		name: "URL",
		description: "Encode and decode URLs",
	},
	{
		href: "/uuid",
		name: "UUID",
		description: "Generate UUIDs",
	},
	{
		href: "/hash",
		name: "Hash",
		description: "Generate cryptographic hashes",
	},
	{
		href: "/diff",
		name: "Diff",
		description: "Compare two texts",
	},
	{
		href: "/jwt",
		name: "JWT",
		description: "Decode JWT tokens",
	},
	{
		href: "/timestamp",
		name: "Timestamp",
		description: "Convert Unix timestamps",
	},
	{
		href: "/color",
		name: "Color",
		description: "Convert between color formats",
	},
	{
		href: "/regex",
		name: "Regex",
		description: "Test regular expressions",
	},
	{
		href: "/yaml",
		name: "YAML",
		description: "Convert between YAML and JSON",
	},
	{
		href: "/lorem",
		name: "Lorem",
		description: "Generate placeholder text",
	},
];

export default function Home() {
	return (
		<div className="py-12">
			<h1 className="font-mono text-4xl font-bold mb-2">confgiuration</h1>
			<p className="text-muted mb-12">Developer utilities</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{tools.map((tool) => (
					<Link
						key={tool.href}
						href={tool.href}
						className="group p-6 rounded-lg border border-border bg-card hover:bg-card-hover hover:border-accent/50 transition-all"
					>
						<h2 className="font-mono text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
							{tool.name}
						</h2>
						<p className="text-muted text-sm">{tool.description}</p>
					</Link>
				))}
			</div>
		</div>
	);
}
