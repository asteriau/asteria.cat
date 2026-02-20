import { use } from "react";
import { format, parseISO } from "date-fns";
import { notFound } from "next/navigation";
import DeferredMDX from "@/components/blog/DeferredMDX";
import TableOfContents from "@/components/blog/TableOfContents";
import TimeAgo from "@/components/time/TimeAgo";
import { NotPublicHover } from "@/components/blog/NotPublicHover";
import { getPostBySlug } from "@/lib/posts";
import { getPostUrl } from "@/lib/site";
import { allPosts } from "contentlayer/generated";

export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post._raw.flattenedPath }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return;

  const { title, datePublished, summary: description } = post;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: datePublished,
      url: getPostUrl(post._raw.flattenedPath),
      images: [
        {
          url: `https://ogimage-workers.kanbaru.workers.dev/?title=${encodeURIComponent(
            title,
          )}&liner=${encodeURIComponent(
            description,
          )}&date=${format(parseISO(post.datePublished), "MMM. dd, yyyy")}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function Page(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const post = getPostBySlug(params.slug);

  if (!post) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 animate-page-in">
      <div className="flex flex-col gap-8 2xl:flex-row 2xl:gap-12">
        <article className="min-w-0 flex-1 max-w-prose">
          <header>
            <h1 className="mb-2 inline max-w-md text-3xl">
              {post.public ? "" : <NotPublicHover />}
              {post.title}
            </h1>

            {post.coAuthors && (
              <div className="my-2 text-md text-neutral-200">
                With {post.coAuthors.join(", ")}
              </div>
            )}

            <div className="mb-8 text-sm text-neutral-200">
              {format(parseISO(post.datePublished), "MMM. dd, yyyy")}
              <span className="text-neutral-400">
                {" "}
                – <TimeAgo date={post.datePublished} />
              </span>

              {post.lastUpdated && (
                <span className="text-neutral-400">
                  {" "}
                  Last updated{" "}
                  {format(
                    parseISO(post.lastUpdated),
                    "MMM. dd, yyyy",
                  )}{" "}
                  –{" "}
                  <TimeAgo
                    date={post.lastUpdated}
                    parentheses={false}
                  />
                  .
                </span>
              )}
            </div>
          </header>

          {/* 👇 THIS is the important bit */}
          <div className="prose prose-invert">
            <DeferredMDX code={post.body.code} />
          </div>
        </article>

        <aside className="2xl:sticky 2xl:top-24 2xl:w-56 2xl:shrink-0 2xl:self-start">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
}
