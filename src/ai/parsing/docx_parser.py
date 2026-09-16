from docx import Document


def extract_text_from_docx(file_path: str) -> str:
    """
    Extract text from a DOCX resume.

    Args:
        file_path: Path to the DOCX file.

    Returns:
        Extracted paragraph text from the DOCX.
    """

    document = Document(file_path)

    paragraphs = []

    for paragraph in document.paragraphs:
        text = paragraph.text.strip()

        if text:
            paragraphs.append(text)

    return "\n".join(paragraphs).strip()