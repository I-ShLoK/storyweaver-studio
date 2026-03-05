from typing import Optional, List

from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips


def compose_clip(image_path: str, audio_path: str, duration: int = 8) -> Optional[str]:
    """
    Combine a single image and audio into a video clip.
    For the hackathon demo we assume image/audio are on disk and return a local path.
    """
    try:
        image_clip = ImageClip(image_path, duration=duration)
        audio_clip = AudioFileClip(audio_path)
        video = image_clip.set_audio(audio_clip)
        output_path = image_path.rsplit(".", 1)[0] + ".mp4"
        video.write_videofile(output_path, fps=24)
        return output_path
    except Exception:
        return None


def compose_timeline(clips: List[str], output_path: str) -> Optional[str]:
    """
    Concatenate multiple clip files into a final video.
    """
    try:
        video_clips = [VideoFileClip(c) for c in clips]  # type: ignore[name-defined]
        final = concatenate_videoclips(video_clips)
        final.write_videofile(output_path, fps=24)
        return output_path
    except Exception:
        return None

