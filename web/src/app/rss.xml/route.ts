import { allPosts } from "content-collections";
import { DATA } from "@/data/resume";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const items = [...allPosts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((post) => {
      const url = `${DATA.url}/blog/${post._meta.path.replace(/\.mdx$/, "")}`;
      return `<item><title>${esc(post.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate><description>${esc(post.summary)}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(DATA.name)} — Notes</title><link>${DATA.url}/blog</link><description>Notes from rebuilding the voice AI stack for Indian languages.</description><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
