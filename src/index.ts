import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { extractQuestionsFromMarkdown, } from './question/parser';
import { exportQuestionsToCsv } from './anki/csv';
import { trimExtension } from './file/filename';

interface AnkiomaticSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: AnkiomaticSettings = {
	mySetting: 'default'
}

export default class AnkiomaticPlugin extends Plugin {
	settings: AnkiomaticSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (_evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribboN
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});

		this.addCommand({
			id: 'export-document-flashcards-apkg',
			name: "Export Current Note to Anki APKG",
			editorCallback: async (editor: Editor, _view: MarkdownView) => {
				const file = this.app.workspace.getActiveFile();

				if (!file) {
					return;
				}

				const filename = trimExtension(file.name);

				const markdown = editor.getValue();
				const question = extractQuestionsFromMarkdown(markdown);

				await exportQuestionsToCsv(question, filename)
			}
		});

		this.addCommand({
			id: 'export-document-flashcards-csv',
			name: 'Export Current Note to Anki CSV',
			editorCallback: async (editor: Editor, _view: MarkdownView) => {
				const file = this.app.workspace.getActiveFile();

				if (!file) {
					return;
				}

				const filename = trimExtension(file.name);

				const markdown = editor.getValue();
				const question = extractQuestionsFromMarkdown(markdown);

				await exportQuestionsToCsv(question, filename)
			}
		});


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: AnkiomaticPlugin;

	constructor(app: App, plugin: AnkiomaticPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
