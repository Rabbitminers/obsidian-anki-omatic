import * as marked from "marked";
import { Question } from "src/question/types";

export async function serializeQuestion(question: Question) {
	const parsedFront = await marked.parse(question.title);
	const parsedBack = await marked.parse(question.body, { breaks: true });

	const front = parsedFront.replace("\n", "");
	const back = parsedBack.replace("\n", "");

	return { front, back }
}
