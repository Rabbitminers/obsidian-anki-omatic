import { extractQuestionsFromMarkdown } from "src/question/parser";
import { TAbstractFile, TFile, TFolder } from "obsidian";
import { Question } from "src/question/types";

async function getContent(file: TFile) {
	return await file.vault.read(file);
}

function isMarkdown(file: TFile) {
	return file.extension === "md";
}

export async function convertAbstractFileToQuestions(file: TAbstractFile): Promise<Question[]> {
	if (file instanceof TFolder) {
		return convertDirectoryToQuestions(file);
	} else if (file instanceof TFile) {
		return convertFileToQuestions(file);
	} else {
		return [];
	}
}

export async function convertDirectoryToQuestions(directory: TFolder): Promise<Question[]> {
	if (directory.children.length === 0) {
		return [];
	}

	const results: Question[] = [];

	for (const child of directory.children) {
		if (child instanceof TFolder) {
			const questions = await convertDirectoryToQuestions(child);

			results.push(...questions);
			continue;
		}

		if (!(child instanceof TFile) || !isMarkdown(child)) {
			continue;
		}

		const questions = await convertFileToQuestions(child);
		results.push(...questions);
	}

	return results;
}

export async function convertFileToQuestions(file: TFile): Promise<Question[]> {
	if (!isMarkdown(file)) {
		return [];
	}

	const content = await getContent(file);
	return extractQuestionsFromMarkdown(content, file);
}

