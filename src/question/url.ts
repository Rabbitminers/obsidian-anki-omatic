import { TFile } from "obsidian";

export function getFileUrl(file: TFile) {
	const vaultName = file.vault.getName();
	const path = file.path;

	return `obsidian://open?value=${vaultName}&file=${path}`;
}
