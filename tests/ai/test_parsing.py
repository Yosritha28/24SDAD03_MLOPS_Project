# from pathlib import Path
#
# from src.ai.parsing.resume_parser import parse_resume
#
#
# PDF_PATH = Path("data/raw/sample_resume.pdf")
# DOCX_PATH = Path("data/raw/sample_resume.docx")
#
#
# def test_pdf_resume_parsing():
#     result = parse_resume(str(PDF_PATH))
#
#     assert result["file_name"] == "sample_resume.pdf"
#     assert result["file_type"] == ".pdf"
#     assert "Alex Johnson" in result["raw_text"]
#     assert "Python" in result["raw_text"]
#
#
# def test_docx_resume_parsing():
#     result = parse_resume(str(DOCX_PATH))
#
#     assert result["file_name"] == "sample_resume.docx"
#     assert result["file_type"] == ".docx"
#     assert "Alex Johnson" in result["raw_text"]
#     assert "Python" in result["raw_text"]



from pathlib import Path

import pytest

from src.ai.parsing.resume_parser import parse_resume


RAW_DATA_DIR = Path("data/raw")


@pytest.mark.parametrize(
    "filename, expected_text",
    [
        ("simple_resume.pdf", "Alex Johnson"),
        ("bullet_resume.pdf", "Priya Sharma"),
        ("multi_page_resume.pdf", "Rahul Verma"),
        ("table_style_resume.pdf", "Ananya Rao"),
        ("simple_resume.docx", "Alex Johnson"),
        ("bullet_resume.docx", "Priya Sharma"),
        ("table_resume.docx", "Ananya Rao"),
    ],
)
def test_resume_file_parsing(filename, expected_text):
    """Every supported resume format should produce text."""

    file_path = RAW_DATA_DIR / filename

    result = parse_resume(str(file_path))

    assert result["file_name"] == filename
    assert result["raw_text"]
    assert expected_text in result["raw_text"]


def test_pdf_content_is_extracted():
    """Important PDF content should be preserved."""

    result = parse_resume(
        str(RAW_DATA_DIR / "simple_resume.pdf")
    )

    text = result["raw_text"]

    assert "Python" in text
    assert "Machine Learning" in text
    assert "Education" in text
    assert "Experience" in text
    assert "Projects" in text


def test_multi_page_resume_is_extracted():
    """Text from both pages should be available."""

    result = parse_resume(
        str(RAW_DATA_DIR / "multi_page_resume.pdf")
    )

    text = result["raw_text"]

    assert "Rahul Verma" in text
    assert "Professional Summary" in text
    assert "Certifications" in text
    assert "ResumeIQ" in text


def test_docx_table_content_is_extracted():
    """DOCX tables should contribute content to the parsed text."""

    result = parse_resume(
        str(RAW_DATA_DIR / "table_resume.docx")
    )

    text = result["raw_text"]

    assert "Ananya Rao" in text
    assert "Python" in text
    assert "Machine Learning" in text
    assert "REST APIs" in text


def test_unsupported_file_format():
    """Unsupported extensions should raise ValueError."""

    fake_file = RAW_DATA_DIR / "resume.txt"
    fake_file.write_text(
        "This is not a supported resume format.",
        encoding="utf-8",
    )

    try:
        with pytest.raises(ValueError):
            parse_resume(str(fake_file))
    finally:
        fake_file.unlink()


def test_missing_file():
    """A missing resume should raise FileNotFoundError."""

    missing_file = RAW_DATA_DIR / "does_not_exist.pdf"

    with pytest.raises(FileNotFoundError):
        parse_resume(str(missing_file))

def test_empty_pdf():
    """An empty PDF should return an empty text result."""

    import pymupdf

    empty_pdf = RAW_DATA_DIR / "empty_resume.pdf"

    document = pymupdf.open()
    document.new_page()
    document.save(empty_pdf)
    document.close()

    try:
        result = parse_resume(str(empty_pdf))

        assert result["file_name"] == "empty_resume.pdf"
        assert result["file_type"] == ".pdf"
        assert result["raw_text"] == ""
    finally:
        empty_pdf.unlink()



def test_invalid_pdf():
    """A corrupted PDF should raise an appropriate parsing error."""

    invalid_pdf = RAW_DATA_DIR / "invalid_resume.pdf"

    invalid_pdf.write_bytes(
        b"This is not a valid PDF file."
    )

    try:
        with pytest.raises(Exception):
            parse_resume(str(invalid_pdf))
    finally:
        invalid_pdf.unlink()