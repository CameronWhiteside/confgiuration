"use client";

import { useState } from "react";

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
	"explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
	"fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi",
	"nesciunt", "neque", "porro", "quisquam", "nihil", "numquam", "eius", "modi",
	"tempora", "incidunt", "magnam", "quaerat",
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
	const wordCount = Math.floor(Math.random() * 10) + 5; // 5-14 words
	const words = generateWords(wordCount);
	return words.charAt(0).toUpperCase() + words.slice(1) + ".";
}

function generateParagraph(): string {
	const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 sentences
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
		case "sentences":
			const sentences: string[] = [];
			for (let i = 0; i < count; i++) {
				sentences.push(generateSentence());
			}
			result = sentences.join(" ");
			break;
		case "paragraphs":
			const paragraphs: string[] = [];
			for (let i = 0; i < count; i++) {
				paragraphs.push(generateParagraph());
			}
			result = paragraphs.join("\n\n");
			break;
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

	const copy = () => {
		navigator.clipboard.writeText(output);
	};

	return (
		<div>
			<h1 className="font-mono text-2xl font-bold mb-6">Lorem Ipsum Generator</h1>

			<div className="flex flex-wrap gap-4 mb-6 items-center">
				<div className="flex items-center gap-2">
					<input
						type="number"
						min={1}
						max={100}
						value={count}
						onChange={(e) =>
							setCount(Math.min(100, Math.max(1, Number(e.target.value))))
						}
						className="w-20 px-3 py-2"
					/>
					<select
						value={unit}
						onChange={(e) => setUnit(e.target.value as Unit)}
						className="bg-card border border-border rounded-lg px-3 py-2"
					>
						<option value="paragraphs">paragraphs</option>
						<option value="sentences">sentences</option>
						<option value="words">words</option>
					</select>
				</div>

				<label className="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						checked={startWithLorem}
						onChange={(e) => setStartWithLorem(e.target.checked)}
						className="rounded"
					/>
					<span className="text-muted">Start with &quot;Lorem ipsum...&quot;</span>
				</label>

				<button
					onClick={handleGenerate}
					className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-accent-hover"
				>
					Generate
				</button>

				<button
					onClick={copy}
					disabled={!output}
					className="px-4 py-2 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-card-hover disabled:opacity-50"
				>
					Copy
				</button>
			</div>

			{output && (
				<div className="p-4 rounded-lg bg-card border border-border">
					<div className="whitespace-pre-wrap text-sm leading-relaxed">
						{output}
					</div>
				</div>
			)}

			{!output && (
				<div className="text-center py-16 text-muted">
					Click Generate to create placeholder text
				</div>
			)}
		</div>
	);
}
