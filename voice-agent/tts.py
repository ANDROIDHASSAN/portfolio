"""Text-to-speech: one fallback chain per language, best voice first. Every engine has a free tier.

  en: ElevenLabs Flash v2.5 (most natural English, ~75 ms) -> Sarvam -> Cartesia -> Groq Orpheus
  hi: Sarvam bulbul:v3 (native Indian Hindi) -> ElevenLabs -> Cartesia
  mr: Sarvam bulbul:v3 -> Cartesia (ElevenLabs Flash has no Marathi)

Engines without an API key are skipped; FallbackAdapter moves on when one errors or runs out of quota.
ElevenLabs' free plan only allows premade voices over the API (library voices return 402).
"""

import os

from livekit.agents import inference, tts
from livekit.plugins import elevenlabs, groq, sarvam

SR = 24000  # same rate on every chain, so switching language never changes the output format
ELEVEN_VOICE = os.getenv("ELEVEN_VOICE_ID", "bIHbv24MWmeRgasZH58o")  # "Will": young, relaxed, conversational
SARVAM_SPEAKER = os.getenv("SARVAM_SPEAKER", "aditya")  # warm young male Indian voice


def _eleven(lang: str) -> tts.TTS:
    # stability 0.45 lets intonation move like real speech; speaker boost keeps the timbre crisp.
    settings = elevenlabs.VoiceSettings(stability=0.45, similarity_boost=0.8, style=0.0, speed=1.0, use_speaker_boost=True)
    return elevenlabs.TTS(voice_id=ELEVEN_VOICE, model="eleven_flash_v2_5", language=lang, encoding=f"pcm_{SR}", voice_settings=settings)


def _sarvam(lang: str) -> tts.TTS:
    # temperature 0.7 (default 0.6) gives livelier intonation; preprocessing reads numbers and mixed script.
    return sarvam.TTS(model="bulbul:v3", speaker=SARVAM_SPEAKER, target_language_code=f"{lang}-IN", temperature=0.7,
                      pace=1.05, enable_preprocessing=True, speech_sample_rate=SR)


def _cartesia(lang: str) -> tts.TTS:
    return inference.TTS("cartesia/sonic-3", voice="9626c31c-bec5-4cca-baa8-f8ba9e84c8bc", language=lang, sample_rate=SR)


def build_tts() -> dict[str, tts.TTS]:
    eleven = _eleven if os.getenv("ELEVEN_API_KEY") else None
    sarv = _sarvam if os.getenv("SARVAM_API_KEY") else None
    order = {"en": [eleven, sarv, _cartesia], "hi": [sarv, eleven, _cartesia], "mr": [sarv, _cartesia]}
    chains = {}
    for lang, makers in order.items():
        engines = [make(lang) for make in makers if make]
        if lang == "en":
            engines.append(groq.TTS(model="canopylabs/orpheus-v1-english", voice="troy"))
        chains[lang] = tts.FallbackAdapter(engines, sample_rate=SR)
    return chains
