import Link from "next/link";
import { getWeeklyPosts } from "@/lib/posts";
import PostCard from "@/components/blog/PostCard";
import Card from "@/components/ui/Card";

export default function WeekliesPage() {
  const posts = getWeeklyPosts();

  return (
    <div className="py-8 animate-page-in mx-auto w-full max-w-prose">
      <Card className="p-6 md:p-8">
        <div className="flex flex-row gap-2 mb-6">
          <Link
            href="/blog"
            className="liquid-glass rounded-full px-3 py-1 border border-white/[0.10] bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] hover:text-white text-sm font-medium transition-all duration-300"
          >
            Main
          </Link>
          <Link
            href="/blog/weeklies"
            className="liquid-glass rounded-full px-3 py-1 border border-paradise-300/30 bg-paradise-300/[0.09] text-paradise-100 text-sm font-medium"
          >
            Weeklies
          </Link>
        </div>

        <div className="mb-6 text-sm text-neutral-300">
          <Link href="https://indieweb.org/week_note" className="a">Weeknote</Link>
          {"-style posts, every week-ish. An effort to cultivate a habit of regular writing and reflection via journaling."}
        </div>

        <div className="flex flex-col divide-y divide-white/[0.06]">
          {posts.map((post) => (
            <PostCard
              key={post._raw.flattenedPath}
              post={post}
              showLastUpdatedForWeekly
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
