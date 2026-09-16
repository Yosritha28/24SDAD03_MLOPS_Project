from pathlib import Path

import pymupdf
from docx import Document


OUTPUT_DIR = Path("data/raw")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


SAMPLE_TEXT = """Alex Johnson
Software Engineer

Skills:
Python, Java, SQL, Machine Learning, Git

Education:
B.Tech in Computer Science

Experience:
Software Engineering Intern - 6 months

Projects:
Resume Screening System using Python and NLP
"""


def create_pdf():
    pdf_path = OUTPUT_DIR / "sample_resume.pdf"

    document = pymupdf.open()
    page = document.new_page()

    page.insert_text(
        (72, 72),
        SAMPLE_TEXT,
        fontsize=12,
    )

    document.save(pdf_path)
    document.close()

    return pdf_path


def create_docx():
    docx_path = OUTPUT_DIR / "sample_resume.docx"

    document = Document()

    for line in SAMPLE_TEXT.splitlines():
        document.add_paragraph(line)

    document.save(docx_path)

    return docx_path


if __name__ == "__main__":
    pdf_path = create_pdf()
    docx_path = create_docx()

    print(f"Created PDF: {pdf_path}")
    print(f"Created DOCX: {docx_path}")