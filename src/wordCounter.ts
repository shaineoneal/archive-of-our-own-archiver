/**
 * Count the number of words in a string
 *
 * Based on the word count algorithm used by AO3
 * @see {@link https://github.com/otwcode/otwarchive/blob/fd5046c72ca2b2f6874aaaf839bd54a5410e2677/lib/word_counter.rb#L5}
 * @param text
 */
export function countWords(text: string): number {
    if (!text.trim()) return 0;

    const characterCountScripts = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}]/gu;

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const body = doc.body;
    if (!body) return 0;

    return Array.from(body.childNodes)
        .reduce((count, node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const cleanedText = node.textContent
                    ?.replace(/--/g, "—")
                    .replace(/['’‘-]/g, "");

                if (cleanedText) {
                    const matches = cleanedText.match(
                        new RegExp(`${characterCountScripts.source}|\\w+`, "gu")
                    );
                    count += matches ? matches.length : 0;
                }
            }
            return count;
        }, 0);
}