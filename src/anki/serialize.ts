import * as marked from "marked";
import { formatLatex } from "src/markdown/latex";

import { Question } from "src/question/types";

export function generateFooter(question: Question) {
	return /* html */ `</br><a style='font-size:small' href='${question.link}'>View in obsidian</a>`
}

export async function serializeQuestion(question: Question) {
	const parsedFront = await marked.parse(question.title);
	const parsedBack = await marked.parse(question.body, { breaks: true, });

	const front = formatLatex(parsedFront).replace("\n", "").replace(/"/g, '""');
	const back = formatLatex(parsedBack).replace("\n", "").replace(/"/g, '""');

	return { front, back }
}
