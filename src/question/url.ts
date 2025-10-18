import { TFile } from "obsidian";

export function getFileUrl(file: TFile) {
	const vaultName = encodeURIComponent(file.vault.getName());
	const path = encodeURIComponent(file.path);

	return `obsidian://open?value=${vaultName}&file=${path}`;
}
