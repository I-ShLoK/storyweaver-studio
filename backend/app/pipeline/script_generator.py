import os

from openai import OpenAI


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_script_from_summary(summary: str) -> str:
    """
    Use OpenAI to generate a narration script.
    """
    if not client.api_key:
        return f"Narration based on: {summary[:200]}"

    prompt = (
        "You are a narration writer. Expand the following summary into a clear, "
        "engaging voiceover script for a short educational video scene:\n\n"
        f"{summary}"
    )

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    text = response.output[0].content[0].text.value  # type: ignore[attr-defined]
    return text.strip()

