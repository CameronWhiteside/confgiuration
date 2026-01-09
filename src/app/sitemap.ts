import { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { getAllArticles } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://confgiuration.dev";

export default function sitemap(): MetadataRoute.Sitemap {
	const currentDate = new Date();

	// Home page
	const homeEntry = {
		url: siteUrl,
		lastModified: currentDate,
		changeFrequency: "daily" as const,
		priority: 1,
	};

	// Tool pages
	const toolEntries = tools.map((tool) => ({
		url: `${siteUrl}${tool.href}`,
		lastModified: currentDate,
		changeFrequency: "weekly" as const,
		priority: 0.9,
	}));

	// Article anchors for deep linking (optional but good for SEO)
	const articles = getAllArticles();
	const articleEntries = articles.map((article) => ({
		url: `${siteUrl}/${article.toolId}#${article.id}`,
		lastModified: currentDate,
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	return [homeEntry, ...toolEntries, ...articleEntries];
}
