import Link from "next/link";
import { getPublicBlogPosts } from "@/lib/posts";
import PostCard from "@/components/blog/PostCard";

export default function BlogPage() {
  const posts = getPublicBlogPosts();

  return (
    <div className="py-8 animate-page-in">
      {/* Navigation tabs - fade in smoothly */}
      <div className="flex flex-row gap-2 text-xl mb-4">
        <Link
          href="#"
          className="bg-neutral-800 hover:bg-neutral-700 px-2 rounded-lg a transition-colors duration-200 opacity-0 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]"
        >
          Main
        </Link>
        <Link
          href="/blog/weeklies"
          className="bg-neutral-700 hover:bg-neutral-600 px-2 rounded-lg a transition-colors duration-200 opacity-0 animate-[fadeIn_0.5s_ease-out_0.25s_forwards]"
        >
          Weeklies
        </Link>
      </div>
      
      {/* Post cards - let PostCard components handle their own animations */}
      <div className="mx-auto w-full max-w-prose">
        {posts.map((post, index) => (
          <PostCard key={post._raw.flattenedPath} post={post} />
        ))}
      </div>
    </div>
  );
}