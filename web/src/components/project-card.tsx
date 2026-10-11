/* eslint-disable @next/next/no-img-element */
import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, type Status } from "@/data/resume";
import { cn } from "@/lib/utils";
import { ProjectVisual, type VisualKey } from "@/components/project-visual";
import { Spotlight } from "@/components/spotlight";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";

interface Props {
  title: string;
  href?: string;
  status: Status;
  description: string;
  dates: string;
  tags: readonly string[];
  image?: string;
  imageDark?: string;
  visual?: VisualKey;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

const STATUS_STYLE: Record<Status, string> = {
  shipped: "border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
  "in-review": "border-blue-500/40 text-blue-700 dark:text-blue-400",
  "in-progress": "border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
  planned: "border-dashed border-border text-muted-foreground",
};

function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant="outline" className={cn("h-6 gap-1.5 px-2 text-[11px] font-medium shrink-0", STATUS_STYLE[status])}>
      {status !== "planned" && (
        <span className="relative flex size-1.5">
          {status === "in-progress" && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          )}
          <span className={cn("relative inline-flex size-1.5 rounded-full", status === "in-review" ? "bg-blue-500" : "bg-emerald-500")} />
        </span>
      )}
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export function ProjectCard({ title, href, status, description, dates, tags, image, imageDark, visual, links, className }: Props) {
  return (
    <Spotlight
      className={cn(
        "flex flex-col h-full border border-border rounded-xl overflow-hidden hover:ring-2 hover:ring-muted hover:-translate-y-0.5 transition-all duration-200 motion-reduce:hover:translate-y-0",
        className
      )}
    >
      {!image && visual && <ProjectVisual name={visual} />}
      {image && (
        <div className="relative shrink-0 border-b border-border bg-muted/40 p-3">
          <img src={image} alt="" className={cn("w-full h-auto", imageDark && "dark:hidden")} />
          {imageDark && <img src={imageDark} alt="" className="w-full h-auto hidden dark:block" />}
        </div>
      )}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="font-semibold">{title}</h3>
            <span className="text-xs text-muted-foreground">{dates}</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            {href && (
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                aria-label={`Open ${title}`}
              >
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            )}
          </div>
        </div>
        <div className="text-xs flex-1 prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert prose-p:my-2 prose-strong:text-foreground">
          <Markdown>{description}</Markdown>
        </div>
        <div className="flex flex-wrap items-center gap-1 mt-auto">
          {tags.map((tag) => (
            <Badge key={tag} className="text-[11px] font-medium border border-border h-6 w-fit px-2" variant="outline">
              {tag}
            </Badge>
          ))}
          {status === "planned" || status === "in-progress" ? (
            <span className="ml-auto text-[11px] text-muted-foreground">repo coming soon</span>
          ) : (
            links?.map((link) => (
              <Link key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="ml-auto">
                <Badge className="flex items-center gap-1.5 text-xs">
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))
          )}
        </div>
      </div>
    </Spotlight>
  );
}
