import Link from "next/link";
import { getWeeklyPosts } from "@/lib/posts";
import PostCard from "@/components/blog/PostCard";

export default function WeekliesPage() {
  const posts = getWeeklyPosts();

  return (
    <div className="py-8 animate-page-in">
      <div>
        <div className="flex flex-row gap-2 text-xl mb-4">
          <Link
            href="/blog"
            className="bg-neutral-700 hover:bg-neutral-600 px-2 rounded-lg a transition-colors duration-200"
          >
            Main
          </Link>
          <Link
            href="/blog/weeklies"
            className="bg-neutral-800 hover:bg-neutral-700 px-2 rounded-lg a transition-colors duration-200"
          >
            Weeklies
          </Link>
        </div>
        <h2 className="text-2xl">Weeklies</h2>
        <div>
          <Link href="https://indieweb.org/week_note" className="a">
            Weeknote
          </Link>
          -style posts, every week-ish.
          <br />
          An effort to cultivate a habit of regular writing and reflection via
          journaling.
          <br />
          Nothing too serious.
        </div>
      </div>
      <div className="mx-auto w-full max-w-prose py-4">
        {posts.map((post) => (
          <PostCard
            key={post._raw.flattenedPath}
            post={post}
            showLastUpdatedForWeekly
          />
        ))}
      </div>
    </div>
  );
}
