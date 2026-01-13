import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutClient } from "./layout-client";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap",
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://confgiuration.com";
const siteName = "confgiuration";
const siteDescription =
	"Free online developer tools for encoding, formatting, generating, and transforming data. Base64, JSON, UUID, Hash, JWT, QR codes, and more. No sign-up required.";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#fafafa" },
		{ media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
	],
};

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: `${siteName} - Free Online Developer Tools`,
		template: `%s | ${siteName}`,
	},
	description: siteDescription,
	keywords: [
		"developer tools",
		"online tools",
		"base64 encoder",
		"base64 decoder",
		"json formatter",
		"json validator",
		"uuid generator",
		"hash generator",
		"jwt decoder",
		"qr code generator",
		"url encoder",
		"url decoder",
		"timestamp converter",
		"regex tester",
		"markdown preview",
		"yaml to json",
		"sql formatter",
		"password generator",
		"color converter",
		"cron parser",
		"diff checker",
		"text tools",
		"encoding tools",
		"free tools",
		"web developer tools",
		"programming tools",
	],
	authors: [{ name: siteName }],
	creator: siteName,
	publisher: siteName,
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
		],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
		other: [
			{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#a855f7" },
		],
	},
	manifest: "/manifest.json",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteUrl,
		siteName: siteName,
		title: `${siteName} - Free Online Developer Tools`,
		description: siteDescription,
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: `${siteName} - Developer Tools`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `${siteName} - Free Online Developer Tools`,
		description: siteDescription,
		images: ["/og-image.png"],
		creator: "@confgiuration",
	},
	alternates: {
		canonical: siteUrl,
	},
	category: "technology",
	classification: "Developer Tools",
	other: {
		"apple-mobile-web-app-capable": "yes",
		"apple-mobile-web-app-status-bar-style": "default",
		"apple-mobile-web-app-title": siteName,
		"format-detection": "telephone=no",
		"mobile-web-app-capable": "yes",
		"msapplication-TileColor": "#a855f7",
		"msapplication-config": "/browserconfig.xml",
	},
};

// JSON-LD structured data for the website
const jsonLd = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: siteName,
	description: siteDescription,
	url: siteUrl,
	potentialAction: {
		"@type": "SearchAction",
		target: {
			"@type": "EntryPoint",
			urlTemplate: `${siteUrl}/?search={search_term_string}`,
		},
		"query-input": "required name=search_term_string",
	},
	publisher: {
		"@type": "Organization",
		name: siteName,
		url: siteUrl,
		logo: {
			"@type": "ImageObject",
			url: `${siteUrl}/logo.png`,
		},
	},
};

// JSON-LD for the software application collection
const softwareJsonLd = {
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	name: siteName,
	description: siteDescription,
	url: siteUrl,
	applicationCategory: "DeveloperApplication",
	operatingSystem: "Any",
	offers: {
		"@type": "Offer",
		price: "0",
		priceCurrency: "USD",
	},
	aggregateRating: {
		"@type": "AggregateRating",
		ratingValue: "4.9",
		ratingCount: "150",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" dir="ltr">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
			>
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
				>
					Skip to main content
				</a>
				<LayoutClient>{children}</LayoutClient>
			</body>
		</html>
	);
}
