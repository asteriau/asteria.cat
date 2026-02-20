import { useMDXComponent } from "next-contentlayer2/hooks";
import Link from "next/link";

/// pretty img wrapper with rounded edges and an optional caption
export function PrettyImage({
  src,
  alt,
  caption,
  round,
  height,
  width,
  className,
  noShadow,
}: {
  src: string;
  alt: string;
  caption?: string;
  round?: boolean;
  noShadow?: boolean;
  height?: string;
  width?: string;
  className?: string;
}) {
  return (
    <figure
      className={`${caption && "shadow-sm shadow-slate-800"} place-self-center w-max`}
      style={{ width: width + "px" }}
    >
      <img
        src={src}
        alt={alt}
        className={`duration-700 delay-200 ${
          noShadow ??
          "bg-black shadow-lg shadow-slate-800"
        } ${caption ? "rounded-t-lg" : round ? "rounded-full" : "rounded-xl"} ${
          className ?? ""
        }`}
        height={height}
        width={width}
      />
      {caption && (
        <div className="bg-[rgb(28,28,28)] text-wrap border-[rgb(51,51,51)] border-[1px] mx-0 pt-1 pb-4 px-4 rounded-b-lg shadow-xl shadow-[rgb(22,22,22)]">
          <figcaption className="text-neutral-200">
            {caption}
          </figcaption>
        </div>
      )}
    </figure>
  );
}

// an embed card, similar to discord's oembed cards
export function EmbedCard({
  url,
  title,
  description,
  thumbnail,
  noShadow,
}: {
  url: string;
  title: string;
  description: string;
  thumbnail?: string;
  noShadow?: boolean;
}) {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="bg-[rgb(28,28,28)] hover:bg-[rgb(35,35,35)] border-[rgb(51,51,51)] border-[1px] mx-0 px-4 py-2 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 shadow-[rgb(22,22,22)] max-w-md w-full">
        {thumbnail != undefined ? (
          <div className="-my-6">
            <PrettyImage
              className="max-h-64 w-full"
              src={thumbnail}
              alt="thumbnail"
              noShadow={noShadow}
            />
          </div>
        ) : (
          ""
        )}
        <a href={url}>
          <div className="text-2xl text-gray-200">
            {title}
          </div>
        </a>
        <div className="">{description}</div>
      </div>
    </div>
  );
}

export const mdxComponents = {
  Image: PrettyImage,
  Card: EmbedCard,
};

export default function MDX({ code }: { code: string }) {
  const MDXContent = useMDXComponent(code);
  return (
    <div className="prose prose-invert">
      <MDXContent components={mdxComponents} />
    </div>
  );
}
