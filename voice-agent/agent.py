"""Hassan's portfolio voice agent. LiveKit orchestrates; Sarvam/Groq do STT, Groq the LLM, Sarvam/LiveKit/Groq the TTS.

Run locally:   python agent.py dev
Deploy (free): lk agent create --project <personal-project> --secrets-file .env.local
"""

import asyncio
import logging
import os
import re
from collections.abc import AsyncIterable

from dotenv import load_dotenv
from livekit.agents import Agent, AgentServer, AgentSession, JobContext, JobProcess, ModelSettings, TurnHandlingOptions, cli, room_io, tts
from livekit.agents.beta import EndCallTool
from livekit.agents.language import LanguageCode
from livekit.plugins import noise_cancellation, silero

from brain import AWAY_GOODBYE, GOODBYE, GREETING, INSTRUCTIONS
from llm import build_llm
from stt import build_stt
from tts import build_tts

load_dotenv(".env.local")

AGENT_NAME = "hassan-agent"  # must match web/src/app/api/voice-token/route.ts
SESSION_LIMIT_S = 5 * 60  # keeps calls inside the free tiers (1,000 agent-minutes/month on the Build plan)
USER_AWAY_S = 45  # both sides silent this long = nobody is there
MAX_SPOKEN_WORDS = 45  # backstop for brain.py's 35-word rule, which the LLM sometimes ignores
# Common words that tell Marathi and Hindi apart (both are written in Devanagari).
MARATHI_WORDS = {"आहे", "आहेत", "मी", "मला", "तुम्ही", "तुम्हाला", "नाही", "आणि", "काय", "कसे", "कशी", "करू", "शकता", "माझे", "माझा", "आम्ही", "होते", "आता", "बद्दल", "मध्ये"}
HINDI_WORDS = {"है", "हैं", "मैं", "मुझे", "आप", "आपको", "नहीं", "और", "क्या", "कैसे", "कर", "सकते", "मेरा", "मेरे", "हम", "था", "अभी", "बारे", "में", "हूँ"}
logger = logging.getLogger("hassan-agent")


class HassanAgent(Agent):
    def __init__(self, voices: dict[str, tts.TTS]) -> None:
        super().__init__(instructions=INSTRUCTIONS, tts=voices["en"], tools=[EndCallTool(
            extra_description="Only when the caller explicitly says bye or asks to hang up. Never after answering a question.",
            end_instructions="say a short, warm goodbye in the caller's language")])
        self.voices = voices  # one TTS fallback chain per language (tts.py)
        self.indic = "hi"  # last Indic language the caller spoke; agent.py updates it from STT

    async def on_enter(self) -> None:
        self.session.generate_reply(instructions=GREETING)

    async def tts_node(self, text: AsyncIterable[str], model_settings: ModelSettings):
        # Voice the reply in the language it is written in. Read up to the first sentence, then:
        # Latin script -> English; Devanagari -> Marathi or Hindi by marker words, ties go to the caller's.
        chunks = aiter(text)
        head = ""
        async for chunk in chunks:
            head += chunk
            if len(head) >= 80 or (any(c.isalpha() for c in head) and head.rstrip()[-1:] in ".?!।"):
                break
        words = set(re.findall(r"[ऀ-ॿ]+", head))
        mr, hi = len(words & MARATHI_WORDS), len(words & HINDI_WORDS)
        lang = "en" if not words else "mr" if mr > hi else "hi" if hi > mr else self.indic
        # The default tts_node reads agent.tts on every reply, so swapping the chain switches the voice.
        self._tts = self.voices[lang]
        logger.info("speaking reply in %s", lang)

        async def replay():
            # Never ramble: once past MAX_SPOKEN_WORDS, stop at the next sentence end.
            spoken = head
            yield head
            async for chunk in chunks:
                yield chunk
                spoken += chunk
                if len(spoken.split()) > MAX_SPOKEN_WORDS and spoken.rstrip()[-1:] in ".?!।;":
                    logger.info("trimmed a long reply after %d words", len(spoken.split()))
                    return

        async for frame in Agent.default.tts_node(self, replay(), model_settings):
            yield frame


def prewarm(proc: JobProcess) -> None:
    proc.userdata["vad"] = silero.VAD.load()  # once per worker process, not once per call


server = AgentServer()
server.setup_fnc = prewarm


@server.rtc_session(agent_name=AGENT_NAME)
async def entrypoint(ctx: JobContext) -> None:
    vad = ctx.proc.userdata["vad"]
    agent = HassanAgent(build_tts())
    session = AgentSession(
        stt=build_stt(vad),
        llm=build_llm(),
        vad=vad,
        turn_handling=TurnHandlingOptions(
            interruption={"resume_false_interruption": True, "false_interruption_timeout": 1.0},  # a cough doesn't cut the reply
            preemptive_generation={"enabled": True, "max_retries": 3},  # reply is ready the moment the turn ends
        ),
        tts_text_transforms=["filter_emoji", "filter_markdown"],
        user_away_timeout=USER_AWAY_S,
    )

    @session.on("user_input_transcribed")
    def _track_language(ev) -> None:
        if ev.is_final and ev.language and (lang := LanguageCode(ev.language).language) in ("hi", "mr"):
            agent.indic = lang

    # Krisp BVC strips background noise from the caller's mic. NOISE_CANCELLATION=0 if the plan rejects it.
    nc = noise_cancellation.BVC() if os.getenv("NOISE_CANCELLATION", "1") != "0" else None
    # record=False: the site promises calls aren't recorded, whatever the LiveKit Cloud project's observability setting is.
    await session.start(agent=agent, room=ctx.room, record=False, room_options=room_io.RoomOptions(audio_input=room_io.AudioInputOptions(noise_cancellation=nc)))

    async def hang_up(goodbye: str) -> None:
        await session.say(goodbye, allow_interruptions=False)
        await ctx.delete_room()  # disconnects the visitor too, so the browser doesn't sit in an empty room

    async def end_after_limit() -> None:
        await asyncio.sleep(SESSION_LIMIT_S)
        await hang_up(GOODBYE)

    tasks = [asyncio.create_task(end_after_limit())]

    @session.on("user_state_changed")
    def _hang_up_if_silent(ev) -> None:
        # A silent caller (or a bot holding a slot) is dropped after USER_AWAY_S, freeing one of the 5 free-tier slots.
        if ev.new_state == "away":
            tasks.append(asyncio.create_task(hang_up(AWAY_GOODBYE)))

    async def _cancel_tasks() -> None:
        for t in tasks:
            t.cancel()

    ctx.add_shutdown_callback(_cancel_tasks)


if __name__ == "__main__":
    cli.run_app(server)
