import { TFile } from "obsidian";

export interface Question {
	title: string;
	body: string;
	file: TFile;
}
