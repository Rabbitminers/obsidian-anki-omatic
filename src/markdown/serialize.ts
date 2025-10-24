import { Marked } from "marked";
import { App, } from "obsidian";
import { formatLatex } from "src/markdown/latex";

import { Question } from "src/question/types";
import { getFileUrl } from "src/question/url";

const WIKILINK_REGEX = /\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g;

function generateFooter(question: Question) {
	const link = getFileUrl(question.file);

	return /* html */ `</br><a style='font-size:small' href='${link}'>View in obsidian</a>`
}

async function preprocess(markdown: string, app: App) {
	return replaceWikilinks(markdown, app);
}

// HACK: rather than actually building a parser extension for marked
// we just swap out wikilinks for standard markdown links then let
// the standard parser convert them to anchor links
//
// We need to handle a couple different formats of wikilink here
//
// - [[link]]
// - [[link|name]]
// - [[link#heading]]
// - [[link#heading|name]]
//
function replaceWikilinks(markdown: string, app: App) {
	return markdown.replace(WIKILINK_REGEX, (_, link, header, text) => {
		const vaultName = encodeURIComponent(app.vault.getName());
		let path;

		if (header) {
			path = encodeURIComponent(`${link}?header=${header}`);
		} else {
			path = encodeURIComponent(link);
		}

		const url = `obsidian://open?value=${vaultName}&file=${path}`;
		const title = text || link;

		return `[${title}](${url})`
	});
}

export async function serializeQuestion(question: Question, app: App) {
	const marked = new Marked({
		breaks: true,
		async: true,
		hooks: {
			preprocess: async markdown => await preprocess(markdown, app),
		}
	});

	const parsedFront = await marked.parse(question.title);
	const parsedBack = await marked.parse(question.body, { breaks: true, });

	const front = formatLatex(parsedFront).replace("\n", "").replace(/"/g, '""');
	const partialBack = formatLatex(parsedBack).replace("\n", "").replace(/"/g, '""');

	const footer = generateFooter(question);
	const back = partialBack + footer;

	return { front, back }
}
