import pymupdf


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from all pages of a PDF resume.

    Args:
        file_path: Path to the PDF file.

    Returns:
        Extracted text from the PDF.
    """

    document = pymupdf.open(file_path)

    pages = []

    try:
        for page in document:
            text = page.get_text()

            if text:
                pages.append(text)

    finally:
        document.close()

    return "\n".join(pages).strip()