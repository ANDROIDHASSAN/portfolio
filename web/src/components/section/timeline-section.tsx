import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { ReactNode } from "react";
import { Timeline, TimelineItem, TimelineConnectItem } from "@/components/timeline";

type Item = {
  title: string;
  dates?: string;
  location?: string;
  description?: string;
  links?: readonly { title: string; href: string; icon?: ReactNode }[];
};

/** The template's hackathon timeline, generalised: a pill label, a heading, a blurb and a vertical timeline. */
export default function TimelineSection({
  label,
  title,
  blurb,
  items,
  marker,
}: {
  label: string;
  title: string;
  blurb: ReactNode;
  items: readonly Item[];
  marker: (item: Item) => string;
}) {
  return (
    <div className="flex min-h-0 flex-col gap-y-8 w-full overflow-hidden">
      <div className="flex flex-col gap-y-4 items-center justify-center">
        <div className="flex items-center w-full">
          <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
          <div className="border bg-primary z-10 rounded-xl px-4 py-1">
            <span className="text-background text-sm font-medium">{label}</span>
          </div>
          <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
        </div>
        <div className="flex flex-col gap-y-3 items-center justify-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center">{title}</h2>
          <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
            {blurb}
          </p>
        </div>
      </div>
      <Timeline>
        {items.map((item) => (
          <TimelineItem key={item.title} className="w-full flex items-start justify-between gap-10">
            <TimelineConnectItem className="flex items-start justify-center">
              <div className="size-10 bg-card z-10 shrink-0 overflow-hidden border rounded-full shadow ring-2 ring-border flex-none grid place-items-center font-mono text-[10px] font-medium text-muted-foreground">
                {marker(item)}
              </div>
            </TimelineConnectItem>
            <div className="flex flex-1 flex-col justify-start gap-2 min-w-0">
              {item.dates && <span className="text-xs text-muted-foreground font-mono">{item.dates}</span>}
              <h3 className="font-semibold leading-snug">{item.title}</h3>
              {item.location && <p className="text-sm text-muted-foreground">{item.location}</p>}
              {item.description && (
                <p className="text-sm text-muted-foreground leading-relaxed wrap-break-word">{item.description}</p>
              )}
              {item.links && item.links.length > 0 && (
                <div className="mt-1 flex flex-row flex-wrap items-start gap-2">
                  {item.links.map((link) => (
                    <Link href={link.href} key={link.href} target="_blank" rel="noopener noreferrer">
                      <Badge className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground">
                        {link.icon}
                        {link.title}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
