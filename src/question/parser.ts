import { Question } from "./types";

export const QUESTION_REGEX = /^>\s*\[!question\]-\s*(.+)$/;
export const CALLOUT_BODY_REGEX = /^>\s?(.*)$/;

export function splitMarkdownDocument(markdown: string) {
	return markdown.split(/\r?\n/);
}

export function extractQuestionsFromMarkdown(markdown: string) {
	const lines = splitMarkdownDocument(markdown);
	const questions: Question[] = [];

	let currentQuestion: Question | null = null;

	// In general we'll go down the markdown document until we
	// find something that looks like > [!question] then take
	// the remaining text on the line as the question
	//
	// Then continue parsing until either "> " is not longer
	// at the start of a line or until another question is
	// encountered
	for (const line of lines) {
		const match = line.match(QUESTION_REGEX);

		if (match) {
			// Don't add a question without a body
			if (currentQuestion && currentQuestion.body) {
				questions.push(currentQuestion);
			}

			const title = match[1].trim();
			currentQuestion = { title, body: '' };
			continue;
		}

		if (!currentQuestion) {
			continue;
		}

		const bodyMatch = line.match(CALLOUT_BODY_REGEX);

		if (bodyMatch) {
			const breaker = currentQuestion.body ? '\n' : '';
			const text = bodyMatch[1];

			currentQuestion.body += `${breaker}${text}`
		} else {
			questions.push(currentQuestion);

			currentQuestion = null;
		}
	}

	if (currentQuestion) {
		questions.push(currentQuestion);
	}

	return questions;
}
