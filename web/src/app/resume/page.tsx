import { DATA, STATUS_LABEL } from "@/data/resume";
import { getPrStatus } from "@/lib/github";
import { ArrowLeft, Download } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Markdown from "react-markdown";

export const metadata: Metadata = {
  title: "Résumé",
  description: `${DATA.name}, ${DATA.title}: experience, production voice agents, open source and education.`,
  alternates: { canonical: "/resume" },
};

// Same data as the home page, laid out as a printable one-pager; `pnpm resume:pdf` prints it to public/.
const md = (text: string) => (
  <Markdown
    components={{
      p: ({ children }) => <p className="mt-0.5">{children}</p>,
      // Relative site links ("/#papers") must still work inside the PDF.
      a: ({ href = "", children }) => <a href={href.startsWith("/") ? DATA.url + href : href} className="underline decoration-neutral-300 underline-offset-2">{children}</a>,
    }}
  >
    {text}
  </Markdown>
);

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`mt-5 break-inside-avoid-page print:mt-2.5 ${className}`}>
      <h2 className="mb-2 border-b border-neutral-200 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{title}</h2>
      <div className="space-y-2.5 print:space-y-1">{children}</div>
    </section>
  );
}

function Row({ left, right, sub }: { left: React.ReactNode; right?: string; sub?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div>
        <span className="font-semibold text-neutral-950">{left}</span>
        {sub && <span className="text-neutral-500"> · {sub}</span>}
      </div>
      {right && <span className="shrink-0 tabular-nums text-neutral-500">{right}</span>}
    </div>
  );
}

export default async function Resume() {
  const prs = await Promise.all(DATA.openSource.map(async (pr) => ({ ...pr, live: await getPrStatus(pr.repo, pr.pr) })));
  const built = DATA.projects.filter((p) => p.status !== "planned");
  const planned = DATA.projects.filter((p) => p.status === "planned");
  const links = [
    { label: DATA.contact.email, href: `mailto:${DATA.contact.email}` },
    { label: "linkedin.com/in/erhassankazi", href: DATA.contact.social.LinkedIn.url },
    { label: "github.com/ANDROIDHASSAN", href: DATA.contact.social.GitHub.url },
    { label: DATA.url.replace("https://", ""), href: DATA.url },
  ];

  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Home
        </Link>
        <a
          href={DATA.resumePdf}
          download="Hassan-Kazi-Resume.pdf"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <Download className="size-4" /> Download PDF
        </a>
      </div>

      <article className="rounded-xl bg-white p-7 text-[12.5px] leading-snug text-neutral-700 shadow-xl ring-1 ring-black/5 sm:p-10 print:rounded-none print:p-0 print:text-[10.5px] print:shadow-none print:ring-0">
        <header>
          <h1 className="text-[26px] font-semibold tracking-tight text-neutral-950 print:text-[22px]">{DATA.name}</h1>
          <p className="mt-0.5 text-[13.5px] text-neutral-800">{DATA.title} · real-time voice agents · Indic speech</p>
          <p className="mt-1.5 flex flex-wrap gap-x-2 text-neutral-500">
            <span>{DATA.location}</span>
            {links.map((l) => (
              <a key={l.href} href={l.href} className="before:mr-2 before:content-['·'] hover:text-neutral-900">{l.label}</a>
            ))}
          </p>
        </header>

        {/* The short description, not DATA.summary: the summary repeats the InCruiter bullet below. Left out of the
            PDF, where the title line under the name already says it, to keep it to one page. */}
        <Section title="Summary" className="print:hidden">{md(DATA.description)}</Section>

        <Section title="Experience">
          {DATA.work.map((w) => (
            <div key={w.company}>
              <Row left={w.title} sub={`${w.company}, ${w.location}`} right={w.start ? `${w.start} – ${w.end}` : undefined} />
              <p className="mt-0.5">{w.description}</p>
            </div>
          ))}
        </Section>

        <Section title="Projects">
          {built.map((p) => (
            <div key={p.title}>
              <Row left={p.title} sub={STATUS_LABEL[p.status]} right={p.technologies.slice(0, 3).join(", ")} />
              {md(p.description)}
            </div>
          ))}
          <p>
            <span className="font-semibold text-neutral-950">Planned: </span>
            {planned.map((p) => p.title).join(", ")}, and {DATA.papers.length} paper reimplementations in PyTorch. Targets, not results yet.
          </p>
        </Section>

        <Section title="Open source · livekit/agents">
          {prs.map((pr) => (
            <div key={pr.pr}>
              <Row left={`#${pr.pr} ${pr.title}`} right={pr.live.label.replace(/^[●✓]\s*/, "")} />
              {/* Hidden in the PDF to keep it to one page; the PR titles already say what each fix does. */}
              <p className="mt-0.5 print:hidden">{pr.description}</p>
            </div>
          ))}
        </Section>

        <Section title="Skills">
          <p>{DATA.skills.map((s) => s.name).join(" · ")}</p>
        </Section>

        <Section title="Education">
          {DATA.education.map((e) => (
            <Row key={e.school} left={e.degree} sub={e.school} right={`${e.start} – ${e.end}`} />
          ))}
        </Section>

        <Section title="Achievements & certifications">
          <ul className="list-disc space-y-0.5 pl-4">
            {DATA.achievements.map((a) => (
              <li key={a.title}>
                <span className="font-medium text-neutral-950">{a.title}</span>
                {a.detail && `: ${a.detail}`}
              </li>
            ))}
            <li>
              <span className="font-medium text-neutral-950">Certifications: </span>
              {DATA.certifications.earned.join(", ")}
            </li>
          </ul>
        </Section>
      </article>
    </main>
  );
}
