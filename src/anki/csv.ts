import { Question } from "src/question/types";
import { serializeQuestion } from "./serialize";
import { downloadBlob } from "src/file/download";

function formatFilename(name: string) {
	return `${name}.csv`;
}

export async function exportQuestionsToCsv(questions: Question[], name: string) {
	const csvLines = ["#separator:Comma", "#html:true", `#deck:${name}`, "#columns:Front,Back"];

	for (const question of questions) {
		const serialized = await serializeQuestion(question);

		csvLines.push(`"${serialized.front}","${serialized.back}"`);
	}

	const csvContent = csvLines.join("\n")

	const filename = formatFilename(name);
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

	downloadBlob(blob, filename);
}
