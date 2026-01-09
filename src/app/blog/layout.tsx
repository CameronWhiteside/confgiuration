import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://confgiuration.dev";

export const metadata: Metadata = {
	title: {
		template: "%s | confgiuration Blog",
		default: "Developer Tools Blog | confgiuration",
	},
	description:
		"Learn about encoding, hashing, UUIDs, JWTs, and other developer tools. Tutorials, best practices, and in-depth guides for web developers.",
	keywords: [
		"developer blog",
		"programming tutorials",
		"web development",
		"encoding guide",
		"security best practices",
		"developer tools",
	],
	openGraph: {
		title: "Developer Tools Blog | confgiuration",
		description:
			"Learn about encoding, hashing, UUIDs, JWTs, and other developer tools. Tutorials, best practices, and in-depth guides.",
		url: `${siteUrl}/blog`,
		siteName: "confgiuration",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Developer Tools Blog | confgiuration",
		description:
			"Learn about encoding, hashing, UUIDs, JWTs, and other developer tools.",
	},
	alternates: {
		canonical: `${siteUrl}/blog`,
	},
};

export default function BlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
