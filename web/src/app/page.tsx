/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import ProjectsSection from "@/components/section/projects-section";
import TimelineSection from "@/components/section/timeline-section";
import WorkSection from "@/components/section/work-section";
import { Icons } from "@/components/icons";
import { allPosts } from "content-collections";
import Link from "next/link";
import { getPrStatus } from "@/lib/github";
import { VoiceAgent } from "@/components/voice-agent";
import { Download, GitPullRequest, Mic, Star, Trophy, Users } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;
const ACHIEVEMENT_ICONS = [Trophy, Star, GitPullRequest, Users];

// Home shows the first HOME_POSTS in this order (production stories first); /blog lists everything by date.
const POST_ORDER = [
  "why-voice-agents-break-on-hindi",
  "telephony-vs-webrtc-voice-agents",
  "false-interruptions-barge-in",
  "voice-agent-hung-up-end-call-tool",
  "keyterm-prompting-voice-agents",
  "hindi-marathi-voice-routing",
  "voice-llm-prompting-35-word-rule",
  "free-multilingual-voice-agent",
  "three-fixes-for-livekit-agents",
  "sub-second-hindi-voice-agent",
];
const HOME_POSTS = 5;

export default async function Page() {
  const voiceEnabled = Boolean(process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET);
  const posts = allPosts
    .map((p) => ({ ...p, slug: p._meta.path.replace(/\.mdx$/, "") }))
    .sort((a, b) => POST_ORDER.indexOf(a.slug) - POST_ORDER.indexOf(b.slug))
    .slice(0, HOME_POSTS);
  const openSource = await Promise.all(
    DATA.openSource.map(async (pr) => {
      const live = await getPrStatus(pr.repo, pr.pr);
      const diff = live.additions === undefined ? "" : ` · +${live.additions} −${live.deletions} · ${live.files} files`;
      return {
        title: pr.title,
        dates: `${pr.repo} #${pr.pr}`,
        location: `${live.label}${diff} · ${pr.tests}`,
        description: pr.description,
        links: [
          { title: `PR #${pr.pr}`, icon: <Icons.github className="h-4 w-4" />, href: `https://github.com/${pr.repo}/pull/${pr.pr}` },
          { title: "Write-up", href: "/blog/three-fixes-for-livekit-agents" },
        ],
      };
    }),
  );
  // One graph: the site, this page as a profile page, and the person it is about (Google's ProfilePage pattern).
  const person = {
    "@type": "Person",
    "@id": `${DATA.url}/#person`,
    name: DATA.name,
    givenName: "Hassan",
    familyName: "Kazi",
    jobTitle: ["Voice AI Engineer", "AI Engineer"],
    description: DATA.description,
    url: DATA.url,
    image: `${DATA.url}/me.webp`,
    email: `mailto:${DATA.contact.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressRegion: "Karnataka", addressCountry: "IN" },
    hasOccupation: {
      "@type": "Occupation",
      name: "Voice AI Engineer",
      occupationLocation: { "@type": "Country", name: "India" },
      skills: DATA.skills.map((s) => s.name).join(", "),
    },
    knowsAbout: [
      "Voice AI", "Conversational AI", "Real-time voice agents", "Speech recognition", "Text-to-speech",
      "LiveKit Agents", "WebRTC", "Telephony", "Twilio", "Exotel", "Vapi", "Keyterm prompting",
      "Barge-in and turn detection", "Hindi", "Marathi", "Large language models", "LLM tool calling", "Prompt engineering",
    ],
    knowsLanguage: ["en", "hi", "mr"],
    worksFor: { "@type": "Organization", name: "InCruiter", url: "https://incruiter.com" },
    alumniOf: DATA.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school, ...(e.href && { url: e.href }) })),
    award: DATA.achievements.map((a) => a.title),
    sameAs: [DATA.contact.social.GitHub.url, DATA.contact.social.LinkedIn.url, "https://github.com/ANDROIDHASSAN/portfolio"],
  };
  const personJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${DATA.url}/#website`, url: DATA.url, name: DATA.name, inLanguage: "en", publisher: { "@id": person["@id"] } },
      {
        "@type": "ProfilePage",
        "@id": `${DATA.url}/#profile`,
        url: DATA.url,
        name: `${DATA.name} — Voice AI Engineer`,
        isPartOf: { "@id": `${DATA.url}/#website` },
        mainEntity: { "@id": person["@id"] },
      },
      person,
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 gap-y-6 flex flex-col md:flex-row justify-between">
            <div className="gap-2 flex flex-col order-2 md:order-1">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]}`}
              />
              <BlurFadeText
                className="text-muted-foreground max-w-[600px] md:text-lg lg:text-xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
              <BlurFade delay={BLUR_FADE_DELAY * 2}>
                <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  {DATA.location}
                  <span className="ml-1 inline-flex h-2.5 items-end gap-[2px] text-emerald-500" aria-hidden>
                    <span className="eq-bar" />
                    <span className="eq-bar" />
                    <span className="eq-bar" />
                    <span className="eq-bar" />
                  </span>
                </span>
              </BlurFade>
              <BlurFade delay={BLUR_FADE_DELAY * 2.5}>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={DATA.resumePdf}
                    download="Hassan-Kazi-Resume.pdf"
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Download className="size-4 transition-transform group-hover:translate-y-0.5" /> Download résumé
                  </a>
                  <a
                    href="#talk"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Mic className="size-4" /> Talk to my AI
                  </a>
                  <Link href="/hire" className="inline-flex items-center px-2 py-2 text-sm text-muted-foreground underline-offset-4 hover:underline">
                    Hire me →
                  </Link>
                </div>
              </BlurFade>
            </div>
            <BlurFade delay={BLUR_FADE_DELAY} className="order-1 md:order-2">
              <div className="group relative size-24 md:size-32">
                <span className="speak-ring" aria-hidden />
                <span className="speak-ring delay" aria-hidden />
                <Avatar className="size-24 md:size-32 border rounded-full shadow-lg ring-4 ring-muted transition-transform duration-300 ease-out group-hover:scale-[1.04] group-hover:-rotate-2 motion-reduce:transform-none">
                  {DATA.avatarUrl && <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />}
                  <AvatarFallback className="text-2xl md:text-3xl font-semibold tracking-tight">{DATA.initials}</AvatarFallback>
                </Avatar>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      <section id="talk">
        <BlurFade delay={BLUR_FADE_DELAY * 2.5}>
          <div className="relative overflow-hidden rounded-xl border border-border bg-card p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground">
                LiveKit · Deepgram · gpt-oss · ElevenLabs · Sarvam
              </span>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Talk to my AI clone</h2>
              <p className="max-w-md text-sm text-muted-foreground text-balance">
                Ask about my work, or how to get into voice AI: roadmaps, internships, jobs, tips. It only knows what&apos;s
                on this site.
              </p>
              <div className="flex gap-1.5 text-xs" aria-label="Languages">
                {["English", "हिंदी", "मराठी"].map((l) => (
                  <span key={l} className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground">{l}</span>
                ))}
              </div>
              <VoiceAgent enabled={voiceEnabled} />
              <p className="text-[11px] text-muted-foreground text-balance">
                You&apos;re talking to an AI, not me. Calls end after 5 minutes or 45 seconds of silence. The transcript
                stays in your browser; this site doesn&apos;t record calls.
              </p>
            </div>
          </div>
        </BlurFade>
      </section>

      <section id="about">
        <div className="flex min-h-0 flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <h2 className="text-xl font-bold">About</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert prose-strong:text-foreground">
              <Markdown>{DATA.summary}</Markdown>
            </div>
          </BlurFade>
        </div>
      </section>

      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">Work Experience</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 6}>
            <WorkSection />
          </BlurFade>
        </div>
      </section>

      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-xl font-bold">Education</h2>
          </BlurFade>
          <div className="flex flex-col gap-8">
            {DATA.education.map((education, index) => (
              <BlurFade key={education.school} delay={BLUR_FADE_DELAY * 8 + index * 0.05}>
                <div className="flex items-center gap-x-3 justify-between">
                  <div className="flex items-center gap-x-3 flex-1 min-w-0">
                    <img
                      src={education.logoUrl}
                      alt={`${education.school} logo`}
                      className="size-8 md:size-10 border rounded-full shadow ring-2 ring-border bg-white object-cover flex-none overflow-hidden"
                    />
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="font-semibold leading-none">
                        {education.href ? (
                          <a href={education.href} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                            {education.school}
                          </a>
                        ) : (
                          education.school
                        )}
                      </div>
                      <div className="font-sans text-sm text-muted-foreground">{education.degree}</div>
                    </div>
                  </div>
                  <div className="text-xs tabular-nums text-muted-foreground text-right flex-none">
                    {education.start} - {education.end}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold">Skills</h2>
          </BlurFade>
          <div className="flex flex-wrap gap-2">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill.name} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <div className="lift border bg-background border-border ring-2 ring-border/20 rounded-xl h-8 w-fit px-4 flex items-center gap-2">
                  {"icon" in skill && skill.icon && <skill.icon className="size-4 rounded overflow-hidden object-contain" />}
                  <span className="text-foreground text-sm font-medium">{skill.name}</span>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="playbook">
        <div className="flex min-h-0 flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 10.5}>
            <h2 className="text-xl font-bold">Voice AI playbook</h2>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              What breaks real voice agents, and what I do about each. Every card points at production work or at code you
              can read.
            </p>
          </BlurFade>
          <div className="grid gap-3 sm:grid-cols-2">
            {DATA.playbook.map((p, i) => (
              <BlurFade key={p.problem} delay={BLUR_FADE_DELAY * 11 + i * 0.03}>
                <div className="lift flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] text-(--viz-1)">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-sm font-semibold leading-snug">{p.problem}</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{p.fix}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {p.proof.map((pr) =>
                      pr.href ? (
                        <a
                          key={pr.label}
                          href={pr.href}
                          {...(pr.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                          className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                        >
                          {pr.label}
                        </a>
                      ) : (
                        <span key={pr.label} className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {pr.label}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="projects">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <ProjectsSection />
        </BlurFade>
      </section>

      <section id="writing">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 12}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-bold">Writing</h2>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">All notes →</Link>
            </div>
          </BlurFade>
          <div className="flex flex-col gap-5">
            {posts.map((post, i) => (
              <BlurFade key={post.slug} delay={BLUR_FADE_DELAY * 12 + i * 0.05}>
                <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-1">
                  <span className="font-medium tracking-tight">
                    {post.title}
                    <span className="ml-1.5 inline-block text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground motion-reduce:transform-none" aria-hidden>→</span>
                  </span>
                  <span className="text-sm text-muted-foreground line-clamp-2">{post.summary}</span>
                </Link>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="open-source">
        <BlurFade delay={BLUR_FADE_DELAY * 13}>
          <TimelineSection
            label="Open Source"
            title="Fixes sent upstream"
            blurb={
              <>
                Bugs I hit running voice agents in production, fixed in{" "}
                <span className="text-foreground font-medium">livekit/agents</span>. All three are in review.
              </>
            }
            items={openSource}
            marker={() => "PR"}
          />
        </BlurFade>
      </section>

      <section id="papers">
        <BlurFade delay={BLUR_FADE_DELAY * 14}>
          <TimelineSection
            label="Papers"
            title="Rebuilding the stack from the papers up"
            blurb={`${DATA.papers.length} reimplementations from scratch, adapted to Hindi and Marathi. All planned: every arXiv link is live, and each repo goes public when it ships.`}
            items={DATA.papers}
            marker={(p) => p.dates ?? ""}
          />
        </BlurFade>
      </section>

      <section id="achievements">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 15}>
            <h2 className="text-xl font-bold">Achievements</h2>
          </BlurFade>
          <div className="flex flex-col gap-6">
            {DATA.achievements.map((a, i) => {
              const Icon = ACHIEVEMENT_ICONS[i % ACHIEVEMENT_ICONS.length];
              return (
                <BlurFade key={a.title} delay={BLUR_FADE_DELAY * 16 + i * 0.05}>
                  <div className="group flex items-center gap-x-3">
                    <div className="spin-on-hover size-8 md:size-10 border rounded-full shadow ring-2 ring-border bg-muted flex-none grid place-items-center text-muted-foreground">
                      <Icon className="size-4" aria-hidden />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="font-semibold leading-none">{a.title}</div>
                      {a.detail && <div className="text-sm text-muted-foreground">{a.detail}</div>}
                    </div>
                  </div>
                </BlurFade>
              );
            })}
          </div>
          <BlurFade delay={BLUR_FADE_DELAY * 17}>
            <div className="flex flex-col gap-3 pt-2">
              <h3 className="text-sm font-semibold">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {DATA.certifications.earned.map((c) => (
                  <Badge key={c} className="h-7 px-3 text-xs font-medium">{c}</Badge>
                ))}
                {DATA.certifications.inProgress.map((c) => (
                  <Badge key={c} variant="outline" className="h-7 px-3 text-xs font-medium border-dashed text-muted-foreground">
                    {c} · in progress
                  </Badge>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      <section id="contact">
        <BlurFade delay={BLUR_FADE_DELAY * 18}>
          <ContactSection />
        </BlurFade>
      </section>
    </main>
  );
}
