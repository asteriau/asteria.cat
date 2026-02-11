import { compareDesc } from "date-fns";
import { allPosts, type Post } from "contentlayer/generated";

function getPublicPostsByKind(isWeekly?: boolean): Post[] {
  return allPosts
    .filter((post) => post.public)
    .filter((p) =>
      isWeekly === undefined ? true : isWeekly ? p.isWeekly : !p.isWeekly
    )
    .sort((a, b) =>
      compareDesc(new Date(a.datePublished), new Date(b.datePublished))
    );
}

export function getPublicBlogPosts(): Post[] {
  return getPublicPostsByKind(false);
}

export function getWeeklyPosts(): Post[] {
  return getPublicPostsByKind(true);
}

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((p) => p._raw.flattenedPath === slug);
}
