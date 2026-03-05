import os
from typing import Optional

from openai import OpenAI


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_voiceover(script: str) -> Optional[bytes]:
    """
    Use OpenAI TTS to generate narration audio.
    Returns raw audio bytes; in a real deployment you would stream this to Supabase storage
    and return a public URL.
    """
    if not client.api_key:
        return None

    response = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        voice="alloy",
        input=script,
        format="mp3",
    )

    return response.read()

