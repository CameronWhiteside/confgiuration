"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { type FAQItem, generateFAQJsonLd } from "@/lib/faq";
import { cn } from "@/lib/utils";

interface FAQSectionProps {
	faqs: FAQItem[];
	title?: string;
	description?: string;
	includeSchema?: boolean;
	className?: string;
}

/**
 * Reusable FAQ Section Component
 * - Renders expandable FAQ items
 * - Includes JSON-LD schema for SEO
 * - Optimized for LLM parsing with semantic HTML
 */
export function FAQSection({
	faqs,
	title = "Frequently Asked Questions",
	description,
	includeSchema = true,
	className,
}: FAQSectionProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	if (faqs.length === 0) return null;

	const jsonLd = includeSchema ? generateFAQJsonLd(faqs) : null;

	return (
		<section
			className={cn("mt-16 pt-8 border-t border-border", className)}
			aria-labelledby="faq-heading"
			itemScope
			itemType="https://schema.org/FAQPage"
		>
			{/* JSON-LD Schema for SEO */}
			{jsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			)}

			{/* Header */}
			<div className="flex items-center gap-3 mb-6">
				<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple/10 to-accent-pink/10">
					<HelpCircle className="w-5 h-5 text-primary" />
				</div>
				<div>
					<h2
						id="faq-heading"
						className="text-xl font-bold text-foreground"
					>
						{title}
					</h2>
					{description && (
						<p className="text-sm text-foreground-muted">{description}</p>
					)}
				</div>
			</div>

			{/* FAQ List */}
			<div className="space-y-3" role="list">
				{faqs.map((faq, index) => (
					<FAQItemComponent
						key={index}
						faq={faq}
						isOpen={openIndex === index}
						onToggle={() => setOpenIndex(openIndex === index ? null : index)}
					/>
				))}
			</div>
		</section>
	);
}

interface FAQItemComponentProps {
	faq: FAQItem;
	isOpen: boolean;
	onToggle: () => void;
}

function FAQItemComponent({ faq, isOpen, onToggle }: FAQItemComponentProps) {
	return (
		<div
			className={cn(
				"rounded-xl border border-border bg-card overflow-hidden transition-all duration-200",
				isOpen && "shadow-md border-border-hover"
			)}
			itemScope
			itemProp="mainEntity"
			itemType="https://schema.org/Question"
			role="listitem"
		>
			{/* Question - Always visible */}
			<button
				onClick={onToggle}
				className="w-full px-5 py-4 text-left flex items-start gap-4 hover:bg-background-secondary/50 transition-colors"
				aria-expanded={isOpen}
			>
				<div className="flex-1 min-w-0">
					<h3
						className="font-medium text-foreground text-base"
						itemProp="name"
					>
						{faq.question}
					</h3>
				</div>
				<ChevronDown 
					className={cn(
						"w-5 h-5 text-foreground-muted flex-shrink-0 mt-0.5 transition-transform duration-200",
						isOpen && "rotate-180"
					)} 
				/>
			</button>

			{/* Answer - Expandable */}
			<div
				className={cn(
					"grid transition-all duration-200",
					isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
				)}
				itemScope
				itemProp="acceptedAnswer"
				itemType="https://schema.org/Answer"
			>
				<div className="overflow-hidden">
					<div className="px-5 pb-4 border-t border-border">
						<p
							className="pt-4 text-foreground-muted leading-relaxed"
							itemProp="text"
						>
							{faq.answer}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Compact FAQ List - Non-expandable, shows all Q&A
 * Better for pages where all content should be visible/crawlable
 */
export function FAQList({
	faqs,
	title = "Frequently Asked Questions",
	className,
}: Omit<FAQSectionProps, "description" | "includeSchema">) {
	if (faqs.length === 0) return null;

	const jsonLd = generateFAQJsonLd(faqs);

	return (
		<section
			className={cn("mt-12", className)}
			aria-labelledby="faq-list-heading"
			itemScope
			itemType="https://schema.org/FAQPage"
		>
			{/* JSON-LD Schema */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			<h2
				id="faq-list-heading"
				className="text-2xl font-bold text-foreground mb-8"
			>
				{title}
			</h2>

			<dl className="space-y-6">
				{faqs.map((faq, index) => (
					<div
						key={index}
						itemScope
						itemProp="mainEntity"
						itemType="https://schema.org/Question"
					>
						<dt
							className="font-semibold text-foreground text-lg mb-2"
							itemProp="name"
						>
							{faq.question}
						</dt>
						<dd
							itemScope
							itemProp="acceptedAnswer"
							itemType="https://schema.org/Answer"
						>
							<p
								className="text-foreground-muted leading-relaxed"
								itemProp="text"
							>
								{faq.answer}
							</p>
						</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
