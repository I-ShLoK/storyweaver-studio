from typing import List, Set


PIPELINE_STAGES = ["summary", "script", "visual_prompt", "image", "audio", "video"]


def compute_affected_stages(changed_fields: List[str]) -> List[str]:
    """
    Map changed fields on the scene to pipeline stages that must be regenerated.

    Dependency graph:
      summary -> script -> visual_prompt -> image -> audio -> video
    """
    affected: Set[str] = set()

    if "summary" in changed_fields:
        affected.update(["summary", "script", "visual_prompt", "image", "audio", "video"])
    if "script" in changed_fields:
        affected.update(["script", "visual_prompt", "image", "audio", "video"])
    if "visual_prompt" in changed_fields:
        affected.update(["visual_prompt", "image", "video"])
    if "audio" in changed_fields:
        affected.update(["audio", "video"])
    if "image" in changed_fields:
        affected.update(["image", "video"])

    ordered = [stage for stage in PIPELINE_STAGES if stage in affected]
    return ordered

