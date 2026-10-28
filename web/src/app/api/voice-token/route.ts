import { AccessToken, AgentDispatchClient, RoomAgentDispatch, RoomConfiguration, TrackSource } from "livekit-server-sdk";

export const dynamic = "force-dynamic";

const AGENT_NAME = "hassan-agent"; // must match portfolio/voice-agent/agent.py
const CALLS_PER_HOUR = 5;
const WARMS_PER_HOUR = 20;
// ponytail: in-memory per-IP limit, reset whenever a serverless instance recycles. Enough to stop casual
// abuse of the free tiers; move to Vercel KV/Upstash if real abuse shows up.
const hits = new Map<string, number[]>();

function rateLimited(key: string, limit: number): boolean {
  const now = Date.now();
  if (hits.size > 10_000) hits.clear(); // bound memory on a long-lived instance
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 3_600_000);
  hits.set(key, [...recent, now]);
  return recent.length >= limit;
}

/**
 * Mints a 1-minute, mic-only token for a fresh room and dispatches the portfolio voice agent into it.
 * `?warm` instead dispatches the agent into an empty `warmup-` room it leaves at once: on the Build plan an idle
 * agent scales to zero and takes 10–20 s to cold-start, so the page wakes it before the visitor clicks.
 */
export async function POST(req: Request) {
  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return Response.json({ error: "The voice agent is not set up yet." }, { status: 503 });
  }
  // Browsers always send Origin on POST, so a missing or foreign one means another site or a script. ("null" from a
  // sandboxed frame is rejected too, without the 500 that new URL("null") would throw.)
  if (req.headers.get("origin")?.replace(/^https?:\/\//, "") !== req.headers.get("host")) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const id = crypto.randomUUID().slice(0, 8);
  if (new URL(req.url).searchParams.has("warm")) {
    if (!rateLimited(`warm:${ip}`, WARMS_PER_HOUR)) {
      await new AgentDispatchClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET).createDispatch(`warmup-${id}`, AGENT_NAME);
    }
    return new Response(null, { status: 204 });
  }
  if (rateLimited(ip, CALLS_PER_HOUR)) {
    return Response.json({ error: "That's a lot of calls! Try again in an hour." }, { status: 429 });
  }

  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, { identity: `visitor-${id}`, ttl: "1m" }); // only needs to last until the join; a short life stops re-joining after hang-up
  token.addGrant({ room: `portfolio-${id}`, roomJoin: true, canSubscribe: true, canPublish: true, canPublishData: false, canPublishSources: [TrackSource.MICROPHONE] });
  token.roomConfig = new RoomConfiguration({ agents: [new RoomAgentDispatch({ agentName: AGENT_NAME })] });
  return Response.json({ serverUrl: LIVEKIT_URL, token: await token.toJwt() });
}
