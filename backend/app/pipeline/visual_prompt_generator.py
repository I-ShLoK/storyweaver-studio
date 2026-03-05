import os

from openai import OpenAI


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_visual_prompt(script: str) -> str:
    """
    Use OpenAI to generate a cinematic visual prompt from the script.
    """
    if not client.api_key:
        return (
            "Cinematic, high-contrast visuals illustrating the key ideas of the script. "
            "Dark background, accent lighting, subtle camera motion."
        )

    prompt = (
        "You are a visual director for AI-generated imagery. "
        "Given the following narration script, describe a single cinematic keyframe "
        "in 1–3 sentences suitable as a prompt for a diffusion model.\n\n"
        f"{script}"
    )

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    text = response.output[0].content[0].text.value  # type: ignore[attr-defined]
    return text.strip()

