"""Speech-to-text with fallback. Every engine has a free tier or free credits.

1. Sarvam saaras:v4, streaming, Hindi/Marathi/English auto-detect. The only one that handles Marathi well.
2. Deepgram nova-3 "multi", streaming, English + Hindi code-switching, fastest, keyterm prompting.
3. Groq Whisper large-v3, auto-detect, not streaming (the FallbackAdapter wraps it with the VAD).

Engines whose API key is missing are skipped. Without SARVAM_API_KEY, Marathi speech is weak.
"""

import logging
import os

from livekit.agents import stt, vad as vad_mod
from livekit.plugins import deepgram, groq, sarvam

KEYTERMS = ["Hassan Kazi", "InCruiter", "InCBot", "IncScreen", "LiveKit", "Sarvam", "WebRTC", "Groq", "Anantkamal", "Hinglish"]


def build_stt(vad: vad_mod.VAD) -> stt.STT:
    engines: list[stt.STT] = []
    if os.getenv("SARVAM_API_KEY"):
        engines.append(sarvam.STT(model="saaras:v4", language="unknown", prompt=", ".join(KEYTERMS)))
    else:
        logging.getLogger("hassan-agent").warning("SARVAM_API_KEY not set: Marathi speech recognition will be weak")
    if os.getenv("DEEPGRAM_API_KEY"):
        engines.append(deepgram.STT(model="nova-3", language="multi", keyterm=KEYTERMS, smart_format=True))
    engines.append(groq.STT(model="whisper-large-v3", language="", detect_language=True, prompt=", ".join(KEYTERMS)))
    return stt.FallbackAdapter(engines, vad=vad)
