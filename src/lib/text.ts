/**
 * Keep the last `n` words of a paragraph together, so the last line is never
 * one or two stranded words. Joins them with non-breaking spaces.
 *
 * For LONG paragraphs, where `.wrap-balance` can't help (browsers stop
 * balancing past about six lines). Short copy uses `.wrap-balance` instead;
 * see globals.css. Headings use `text-balance` and are left alone.
 */
export function keepLastWords(text: string, n = 3): string {
  const words = text.split(" ");
  if (words.length <= n + 2) return text;
  return [...words.slice(0, -n), words.slice(-n).join(" ")].join(" ");
}
