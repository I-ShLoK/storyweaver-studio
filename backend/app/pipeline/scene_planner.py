from typing import List, Dict


def plan_scenes_from_sections(sections: List[str]) -> List[Dict]:
    """
    For each section, create a basic scene plan.
    """
    plans = []
    for idx, section in enumerate(sections):
        plans.append(
            {
                "order_index": idx,
                "source_section": section,
                "summary": section[:200],
            }
        )
    return plans

