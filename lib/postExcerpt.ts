import type { Post } from "contentlayer/generated";

export const REASONABLE_LENGTH = 160;

/**
 * Extracts and truncates the first paragraph from a post's raw body.
 */
export function getFirstParagraph(
  post: Post,
  maxLength: number = REASONABLE_LENGTH
): string {
  const split = post.body.raw.split("\n");
  let firstParagraph = "";
  for (let i = 0; i < split.length; i++) {
    firstParagraph += " " + split[i];
    if (split[i].length > maxLength) break;
  }
  firstParagraph = firstParagraph.replace(/<[^>]*>?/gm, "");
  firstParagraph = firstParagraph.replace(/[#/\[\]*>]/g, "");
  firstParagraph = firstParagraph.replace(/\(.*?\)/g, "");
  if (firstParagraph.length > maxLength) {
    firstParagraph = firstParagraph.substring(0, maxLength) + "...";
    if (
      firstParagraph.endsWith(" ...") ||
      firstParagraph.endsWith(",...") ||
      firstParagraph.endsWith("....")
    ) {
      firstParagraph =
        firstParagraph.substring(0, firstParagraph.length - 4) + "...";
    }
  }
  return firstParagraph;
}
