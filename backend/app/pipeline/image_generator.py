import os
from typing import Optional

import replicate


def generate_image_from_prompt(visual_prompt: str) -> Optional[str]:
    """
    Call Replicate to generate an image from the visual prompt.
    Returns a URL to the generated image stored on Replicate / Supabase.
    For the hackathon demo, we return a placeholder if the token is missing.
    """
    token = os.getenv("REPLICATE_API_TOKEN")
    if not token:
        # Placeholder image – could be any static CDN image
        return "https://placehold.co/1024x576/0b0b0b/ff1f3d?text=StoryWeaver+Scene"

    client = replicate.Client(api_token=token)

    # You can swap this model slug for your preferred diffusion model.
    model = "black-forest-labs/flux-1.1-pro"

    output = client.run(
        f"{model}",
        input={
            "prompt": visual_prompt,
            "num_outputs": 1,
        },
    )

    # Many Replicate models return a list of URLs
    if isinstance(output, list) and output:
        return str(output[0])

    return None

