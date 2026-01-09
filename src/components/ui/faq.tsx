"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
					<FAQItem
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

interface FAQItemProps {
	faq: FAQItem;
	isOpen: boolean;
	onToggle: () => void;
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
	return (
		<div
			className={cn(
				"rounded-xl border border-border bg-card overflow-hidden transition-shadow duration-200",
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
				aria-controls={`faq-answer-${faq.question.slice(0, 20).replace(/\s/g, "-")}`}
			>
				<div className="flex-1 min-w-0">
					<h3
						className="font-medium text-foreground text-base"
						itemProp="name"
					>
						{faq.question}
					</h3>
				</div>
				<motion.div
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.2 }}
					className="flex-shrink-0 mt-0.5"
				>
					<ChevronDown className="w-5 h-5 text-foreground-muted" />
				</motion.div>
			</button>

			{/* Answer - Expandable */}
			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
						id={`faq-answer-${faq.question.slice(0, 20).replace(/\s/g, "-")}`}
						itemScope
						itemProp="acceptedAnswer"
						itemType="https://schema.org/Answer"
					>
						<div className="px-5 pb-4 border-t border-border">
							<p
								className="pt-4 text-foreground-muted leading-relaxed"
								itemProp="text"
							>
								{faq.answer}
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
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
