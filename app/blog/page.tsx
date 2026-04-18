import Link from "next/link";
import { getPublicBlogPosts } from "@/lib/posts";
import PostCard from "@/components/blog/PostCard";
import Card from "@/components/ui/Card";

export default function BlogPage() {
  const posts = getPublicBlogPosts();

  return (
    <div className="py-8 animate-page-in mx-auto w-full max-w-prose">
      <Card className="p-6 md:p-8">
        <div className="flex flex-row gap-2 mb-6">
          <Link
            href="#"
            className="liquid-glass glass-active rounded-full px-3 py-1 bg-paradise-300/[0.10] text-paradise-100 text-sm font-medium"
          >
            Main
          </Link>
          <Link
            href="/blog/weeklies"
            className="liquid-glass rounded-full px-3 py-1 bg-white/[0.05] text-neutral-300 hover:bg-white/[0.09] hover:text-white text-sm font-medium transition-all duration-300"
          >
            Weeklies
          </Link>
        </div>

        <div className="flex flex-col divide-y divide-white/[0.06]">
          {posts.map((post) => (
            <PostCard key={post._raw.flattenedPath} post={post} />
          ))}
        </div>
      </Card>
    </div>
  );
}
