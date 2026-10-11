import type { MetadataRoute } from "next";
import { allPosts } from "content-collections";
import { DATA } from "@/data/resume";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts.map((post) => ({
    url: `${DATA.url}/blog/${post._meta.path.replace(/\.mdx$/, "")}`,
    lastModified: post.updatedAt ?? post.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [
    { url: DATA.url, changeFrequency: "weekly", priority: 1 },
    { url: `${DATA.url}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${DATA.url}/resume`, changeFrequency: "monthly", priority: 0.8 },
    ...posts,
  ];
}
