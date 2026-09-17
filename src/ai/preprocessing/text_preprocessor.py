"""
ResumeIQ - Resume Text Preprocessing

This module provides conservative text preprocessing for resumes.

The preprocessing stage is intentionally designed to preserve
information that may be useful for resume-job matching, including
technical terms, numbers, and common programming-language symbols.
"""

import re


# Common bullet characters found in resumes.
BULLET_PATTERN = re.compile(r"[•●▪◦‣⁃∙]")

# Control characters except newline and tab.
CONTROL_CHARACTER_PATTERN = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]")

# Multiple whitespace characters.
WHITESPACE_PATTERN = re.compile(r"\s+")


def normalize_line_endings(text: str) -> str:
    """
    Normalize Windows and old-style line endings to '\\n'.
    """
    if not isinstance(text, str):
        raise TypeError("text must be a string")

    return text.replace("\r\n", "\n").replace("\r", "\n")


def normalize_bullets(text: str) -> str:
    """
    Replace common Unicode bullet characters with a standard hyphen.
    """
    return BULLET_PATTERN.sub("-", text)


def remove_control_characters(text: str) -> str:
    """
    Remove unwanted control characters while preserving
    normal whitespace and newlines.
    """
    return CONTROL_CHARACTER_PATTERN.sub("", text)


def normalize_whitespace(text: str) -> str:
    """
    Collapse repeated whitespace into single spaces and
    normalize surrounding whitespace.
    """
    return WHITESPACE_PATTERN.sub(" ", text).strip()


def preprocess_text(text: str) -> str:
    """
    Apply the complete conservative preprocessing pipeline.

    Parameters
    ----------
    text : str
        Raw text extracted from a resume.

    Returns
    -------
    str
        Cleaned and normalized resume text.
    """
    if not isinstance(text, str):
        raise TypeError("text must be a string")

    if not text.strip():
        return ""

    # Step 1: Normalize line endings.
    text = normalize_line_endings(text)

    # Step 2: Normalize bullet characters.
    text = normalize_bullets(text)

    # Step 3: Remove unwanted control characters.
    text = remove_control_characters(text)

    # Step 4: Normalize whitespace.
    text = normalize_whitespace(text)

    # Step 5: Lowercase for consistent lexical processing.
    text = text.lower()

    return text