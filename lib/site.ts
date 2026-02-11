import siteconfig from "@/siteconfig.json";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (typeof siteconfig?.site === "string"
    ? `https://${siteconfig.site.replace(/^https?:\/\//, "")}`
    : "https://blog.asteria.cat");

export function getSiteUrl(): string {
  return baseUrl;
}

export function getPostUrl(slug: string): string {
  return `${baseUrl}/posts/${slug}`;
}
