"""LLM with fallback, all free.

Groq's free tier now serves only gpt-oss-120b and gpt-oss-20b, each capped at 8,000 tokens/minute and 1,000
requests/day. 120b writes better Hindi and Marathi; when it hits its per-minute cap the call moves to 20b, and
then to LiveKit Inference (paid from the Build plan's free credits, no extra key). Replies are capped at 200
tokens: voice answers are short, and Groq counts the reserved output against the per-minute budget.
"""

from livekit.agents import inference, llm
from livekit.plugins import groq


def build_llm() -> llm.LLM:
    return llm.FallbackAdapter(
        [
            # 0.4: lively enough to sound human, low enough that it stops embellishing facts
            groq.LLM(model="openai/gpt-oss-120b", temperature=0.4, max_completion_tokens=200),
            groq.LLM(model="openai/gpt-oss-20b", temperature=0.4, max_completion_tokens=200),
            inference.LLM("openai/gpt-4.1-mini"),
        ]
    )
