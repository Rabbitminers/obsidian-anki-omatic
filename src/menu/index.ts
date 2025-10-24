import { App, Menu, Notice, TAbstractFile, } from "obsidian";
import { exportQuestionsToCsv } from "src/anki/csv";
import { convertAbstractFileToQuestions } from "src/anki/export";
import { trimExtension } from "src/file/filename";

export function handleFileMenu(menu: Menu, file: TAbstractFile, app: App) {
	const handleClick = async () => {
		const questions = await convertAbstractFileToQuestions(file);
		const filename = trimExtension(file.name);

		if (questions.length === 0) {
			new Notice("No flashcards found here");
			return;
		}

		await exportQuestionsToCsv(questions, filename, app);
	}

	menu.addItem(item => {
		item.setTitle("Export to Anki")
			.setIcon("file-up")
			.setSection("action")
			.onClick(handleClick);
	})

}
