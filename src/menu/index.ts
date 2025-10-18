import { Menu, TAbstractFile, } from "obsidian";
import { exportQuestionsToCsv } from "src/anki/csv";
import { convertAbstractFileToQuestions } from "src/anki/export";
import { trimExtension } from "src/file/filename";

export function handleFileMenu(menu: Menu, file: TAbstractFile, source: string) {
	const handleClick = async () => {
		const questions = await convertAbstractFileToQuestions(file);
		const filename = trimExtension(file.name);

		await exportQuestionsToCsv(questions, filename);
	}

	menu.addItem(item => {
		item.setTitle("Export to Anki")
			.setIcon("file-up")
			.setSection("action")
			.onClick(handleClick);
	})

}
