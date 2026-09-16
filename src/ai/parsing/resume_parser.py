from pathlib import Path

from .docx_parser import extract_text_from_docx
from .pdf_parser import extract_text_from_pdf


SUPPORTED_EXTENSIONS = {".pdf", ".docx"}


def parse_resume(file_path: str) -> dict:
    """
    Parse a PDF or DOCX resume and return
    standardized resume information.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Resume file not found: {file_path}"
        )

    extension = path.suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file format: {extension}. "
            f"Supported formats: PDF and DOCX."
        )

    if extension == ".pdf":
        text = extract_text_from_pdf(file_path)
    else:
        text = extract_text_from_docx(file_path)

    return {
        "file_name": path.name,
        "file_type": extension,
        "raw_text": text,
    }