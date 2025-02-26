export function extractTextFromRichText(richText: string): string {
	let plainText = richText
		.replace(/<\/?(blockgroup|blockcontainer)[^>]*>/g, "\n")
		.replace(/<\/?(heading|paragraph|numberedlistitem|code|link)[^>]*>/g, "")
		.replace(/<\/?[^>]+(>|$)/g, "");
	plainText = plainText.replace(/\n\s*\n/g, "\n").trim();

	return plainText;
}
