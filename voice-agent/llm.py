"""LLM with fallback, all free.

Groq's free tier now serves only gpt-oss-120b and gpt-oss-20b, each capped at 8,000 tokens/minute and 200,000
tokens/day; with a ~2,500-token prompt resent every turn, the daily cap is well under a hundred turns. Order is by
how well each model follows the prompt's facts and language rules, tested on the same questions: 120b, then
gpt-4.1-mini on LiveKit Inference (Build-plan credits, no extra key), then 20b, which invented project details and
mixed up Hindi and Marathi in testing, so it only answers when both others are out. Replies are capped at 200 tokens:
voice answers are short, and Groq counts the reserved output against the per-minute budget.
"""

from livekit.agents import inference, llm
from livekit.plugins import groq

# gpt-oss reasons before it answers, and reasoning tokens count toward max_completion_tokens. At the API's default
# ("medium") a test spent 198 of 200 tokens thinking and returned an empty reply, which the caller hears as silence.
# The plugin defaults to "low" today; pinned here so an upstream change can't bring that back.
GROQ = dict(temperature=0.4, max_completion_tokens=200, reasoning_effort="low")


def build_llm() -> llm.LLM:
    return llm.FallbackAdapter(
        [
            # 0.4: lively enough to sound human, low enough that it stops embellishing facts
            groq.LLM(model="openai/gpt-oss-120b", **GROQ),
            inference.LLM("openai/gpt-4.1-mini"),
            groq.LLM(model="openai/gpt-oss-20b", **GROQ),
        ]
    )
