from typing import List


def split_document_into_sections(content: str) -> List[str]:
    """
    Very simple splitter for demo purposes: split by double newlines.
    """
    sections = [s.strip() for s in content.split("\n\n") if s.strip()]
    return sections or [content]

