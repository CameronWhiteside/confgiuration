"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

const LOREM_WORDS = [
	"lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
	"sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
	"magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
	"exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
	"consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
	"velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
	"occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
	"deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
	"omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
	"laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
	"inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
];

type Unit = "paragraphs" | "sentences" | "words";

function generateWords(count: number): string {
	const words: string[] = [];
	for (let i = 0; i < count; i++) {
		words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
	}
	return words.join(" ");
}

function generateSentence(): string {
	const wordCount = Math.floor(Math.random() * 10) + 5;
	const words = generateWords(wordCount);
	return words.charAt(0).toUpperCase() + words.slice(1) + ".";
}

function generateParagraph(): string {
	const sentenceCount = Math.floor(Math.random() * 4) + 3;
	const sentences: string[] = [];
	for (let i = 0; i < sentenceCount; i++) {
		sentences.push(generateSentence());
	}
	return sentences.join(" ");
}

function generate(count: number, unit: Unit, startWithLorem: boolean): string {
	let result: string;

	switch (unit) {
		case "words":
			result = generateWords(count);
			break;
		case "sentences": {
			const sentences: string[] = [];
			for (let i = 0; i < count; i++) {
				sentences.push(generateSentence());
			}
			result = sentences.join(" ");
			break;
		}
		case "paragraphs": {
			const paragraphs: string[] = [];
			for (let i = 0; i < count; i++) {
				paragraphs.push(generateParagraph());
			}
			result = paragraphs.join("\n\n");
			break;
		}
	}

	if (startWithLorem) {
		result = "Lorem ipsum dolor sit amet" + (unit === "words" ? " " : ", ") + result;
	}

	return result;
}

export default function LoremPage() {
	const [count, setCount] = useState(3);
	const [unit, setUnit] = useState<Unit>("paragraphs");
	const [startWithLorem, setStartWithLorem] = useState(true);
	const [output, setOutput] = useState("");

	const handleGenerate = () => {
		setOutput(generate(count, unit, startWithLorem));
	};

	return (
		<ToolLayout toolId="lorem">
			<div className="space-y-6">
				{/* Controls */}
				<Card hover={false} className="p-4">
					<div className="flex flex-wrap items-end gap-4">
						<div className="w-24">
							<Input
								label="Count"
								type="number"
								min={1}
								max={100}
								value={count}
								onChange={(e) =>
									setCount(Math.min(100, Math.max(1, Number(e.target.value))))
								}
							/>
						</div>

						<div className="w-40">
							<Select
								label="Unit"
								value={unit}
								onChange={(e) => setUnit(e.target.value as Unit)}
							>
								<option value="paragraphs">Paragraphs</option>
								<option value="sentences">Sentences</option>
								<option value="words">Words</option>
							</Select>
						</div>

						<label className="flex items-center gap-2 text-sm pb-2">
							<input
								type="checkbox"
								checked={startWithLorem}
								onChange={(e) => setStartWithLorem(e.target.checked)}
								className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
							/>
							<span className="text-foreground-muted">Start with &quot;Lorem ipsum...&quot;</span>
						</label>

						<Button onClick={handleGenerate} className="flex items-center gap-2">
							<RefreshCw className="w-4 h-4" />
							Generate
						</Button>
					</div>
				</Card>

				{/* Output */}
				{output ? (
					<Card hover={false}>
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm font-medium text-foreground-muted">
								Generated Text
							</span>
							<CopyButton text={output} />
						</div>
						<div className="prose prose-sm max-w-none">
							<div className="whitespace-pre-wrap text-foreground leading-relaxed">
								{output}
							</div>
						</div>
					</Card>
				) : (
					<div className="text-center py-16 text-foreground-muted">
						Click Generate to create placeholder text
					</div>
				)}
			</div>
		</ToolLayout>
	);
}
