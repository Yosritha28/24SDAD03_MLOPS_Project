from pathlib import Path

from src.ai.parsing.resume_parser import parse_resume


PDF_PATH = Path("data/raw/sample_resume.pdf")
DOCX_PATH = Path("data/raw/sample_resume.docx")


def test_pdf_resume_parsing():
    result = parse_resume(str(PDF_PATH))

    assert result["file_name"] == "sample_resume.pdf"
    assert result["file_type"] == ".pdf"
    assert "Alex Johnson" in result["raw_text"]
    assert "Python" in result["raw_text"]


def test_docx_resume_parsing():
    result = parse_resume(str(DOCX_PATH))

    assert result["file_name"] == "sample_resume.docx"
    assert result["file_type"] == ".docx"
    assert "Alex Johnson" in result["raw_text"]
    assert "Python" in result["raw_text"]