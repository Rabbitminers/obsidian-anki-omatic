const INLINE_LATEX_REGEX = /(?<!\$)\$((?=[\S])(?=[^$])[\s\S]*?\S)\$/g;
const DISPLAY_LATEX_REGEX = /\$\$([\s\S]*?)\$\$/g;

export function formatInlineLatex(markdown: string) {
	return markdown.replaceAll(INLINE_LATEX_REGEX, "\\( $1 \\)");
}

export function formatDispayLatex(markdown: string) {
	return markdown.replaceAll(DISPLAY_LATEX_REGEX, "\\[ $1 \\]");
}

export function formatLatex(markdown: string) {
	return formatDispayLatex(formatInlineLatex(markdown));
}
