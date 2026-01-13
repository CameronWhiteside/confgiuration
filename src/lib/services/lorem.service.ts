import {
	type LoremGenerateInput,
	type LoremOutput,
	type Result,
	ok,
} from "./types";

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

/**
 * Generate Lorem Ipsum placeholder text
 */
export function generateLorem(input: LoremGenerateInput): Result<LoremOutput> {
	const count = Math.min(Math.max(input.count ?? 3, 1), 100);
	const type = input.type ?? "paragraphs";

	let result: string;

	switch (type) {
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
		case "paragraphs":
		default: {
			const paragraphs: string[] = [];
			for (let i = 0; i < count; i++) {
				paragraphs.push(generateParagraph());
			}
			result = paragraphs.join("\n\n");
			break;
		}
	}

	// Optionally start with traditional Lorem ipsum opener
	// (can be controlled via input parameter if needed)

	return ok({ result });
}
