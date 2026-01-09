import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "confgiuration",
	description: "Developer utilities",
};

const tools = [
	{ href: "/json", name: "JSON" },
	{ href: "/env", name: "ENV" },
	{ href: "/base64", name: "Base64" },
	{ href: "/url", name: "URL" },
	{ href: "/uuid", name: "UUID" },
	{ href: "/hash", name: "Hash" },
	{ href: "/diff", name: "Diff" },
	{ href: "/jwt", name: "JWT" },
	{ href: "/timestamp", name: "Timestamp" },
	{ href: "/color", name: "Color" },
	{ href: "/regex", name: "Regex" },
	{ href: "/yaml", name: "YAML" },
	{ href: "/lorem", name: "Lorem" },
];

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
			>
				<nav className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
					<div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6 overflow-x-auto">
						<Link
							href="/"
							className="font-mono text-lg font-semibold text-foreground hover:text-accent transition-colors shrink-0"
						>
							confgiuration
						</Link>
						<div className="flex items-center gap-1 text-sm">
							{tools.map((tool) => (
								<Link
									key={tool.href}
									href={tool.href}
									className="px-3 py-1.5 rounded-md text-muted hover:text-foreground hover:bg-card transition-colors shrink-0"
								>
									{tool.name}
								</Link>
							))}
						</div>
					</div>
				</nav>
				<main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
			</body>
		</html>
	);
}
