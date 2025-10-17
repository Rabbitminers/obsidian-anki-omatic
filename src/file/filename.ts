export function trimExtension(filename: string) {
	return filename.replace(/\.[^/.]+$/, "")
}
