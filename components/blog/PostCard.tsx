import Link from "next/link";
import { format, parseISO } from "date-fns";
import type { Post } from "contentlayer/generated";
import TimeAgo from "@/components/time/TimeAgo";
import { getFirstParagraph } from "@/lib/postExcerpt";

interface PostCardProps {
  post: Post;
  showLastUpdatedForWeekly?: boolean;
}

export default function PostCard({
  post,
  showLastUpdatedForWeekly = false,
}: PostCardProps) {
  const firstParagraph = getFirstParagraph(post);
  const showLastUpdated = showLastUpdatedForWeekly
    ? post.lastUpdated && post.isWeekly
    : post.lastUpdated;

  return (
    <div className="mb-8">
      <h2 className="mb-1 text-xl">
        <Link
          href={post.url}
          className="text-blue-700 hover:text-blue-300 dark:text-blue-400"
        >
          {post.title}
        </Link>
      </h2>
      <div className="text-sm mb-2 dark:text-gray-100 text-gray-800">
        {format(parseISO(post.datePublished), "MMM. dd, yyyy")}{" "}
        <span className="dark:text-gray-400 text-gray-700">
          <TimeAgo date={post.datePublished} />
        </span>
        <span className="text-sm mb-8 dark:text-gray-400 text-gray-700">
          {showLastUpdated && (
            <>
              {" • "}
              Last updated{" "}
              {format(parseISO(post.lastUpdated!), "MMM. dd, yyyy")}{" "}
              - <TimeAgo date={post.lastUpdated!} parentheses={false} />.
            </>
          )}
        </span>
      </div>
      <div className="text-sm mb-2"> {post.summary} </div>
      <div className="text-sm [&>*]:mb-3 [&>*:last-child]:mb-0">
        {firstParagraph}
      </div>
    </div>
  );
}
