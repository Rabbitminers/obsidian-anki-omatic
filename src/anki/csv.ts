import { Question } from "src/question/types";
import { serializeQuestion } from "src/markdown/serialize";
import { downloadBlob } from "src/file/download";
import { App } from "obsidian";

function formatFilename(name: string) {
	return `${name}.csv`;
}

export async function exportQuestionsToCsv(questions: Question[], name: string, app: App) {
	const csvLines = [
		"#separator:Comma",
		"#html:true",
		`#deck:${name}`,
		"#columns:Front,Back"
	];

	for (const question of questions) {
		const serialized = await serializeQuestion(question, app);

		csvLines.push(`"${serialized.front}","${serialized.back}"`);
	}

	const csvContent = csvLines.join("\n")

	const filename = formatFilename(name);
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

	downloadBlob(blob, filename);
}
