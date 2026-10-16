import { allPosts } from "content-collections";
import { DATA, STATUS_LABEL } from "@/data/resume";

export const dynamic = "force-static";

// llms.txt: a plain-text summary for AI assistants and AI search, built from the same data as the site.
export function GET() {
  const posts = allPosts.map((p) => `- [${p.title}](${DATA.url}/blog/${p._meta.path.replace(/\.mdx$/, "")}): ${p.summary}`);
  const body = `# ${DATA.name}

> ${DATA.description}

${DATA.name} is a voice AI and AI engineer in Bengaluru, India (open to remote, IST). Contact: ${DATA.contact.email}. Résumé: ${DATA.url}${DATA.resumePdf}. Hiring page: ${DATA.url}/hire.

## Work
${DATA.work.map((w) => `- ${w.title}, ${w.company} (${w.location})${w.start ? `, ${w.start} – ${w.end}` : ""}: ${w.description}`).join("\n")}

## Projects
${DATA.projects.map((p) => `- ${p.title} [${STATUS_LABEL[p.status]}]: ${p.description.replace(/\*\*/g, "").replace(/\n+/g, " ")}`).join("\n")}

## Open source (${DATA.openSource.length} merged PRs)
${DATA.openSource.map((pr) => `- ${pr.repo}#${pr.pr} ${pr.title}: ${pr.description}`).join("\n")}

## Papers reimplemented from scratch
${DATA.papers.map((p) => `- ${p.title} (${p.location}): ${p.description}${p.links[0].title === "Code" ? ` ${p.links[0].href}` : ""}`).join("\n")}

## Voice AI playbook
${DATA.playbook.map((p) => `- ${p.problem}: ${p.fix}`).join("\n")}

## Skills
${DATA.skills.map((s) => s.name).join(", ")}

## Notes
${posts.join("\n")}

## Links
- GitHub: ${DATA.contact.social.GitHub.url}
- LinkedIn: ${DATA.contact.social.LinkedIn.url}
- Source of this site and its voice agent: https://github.com/ANDROIDHASSAN/portfolio
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
