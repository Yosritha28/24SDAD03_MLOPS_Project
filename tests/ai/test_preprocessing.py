import pytest

from src.ai.preprocessing.text_preprocessor import (
    normalize_line_endings,
    normalize_bullets,
    normalize_whitespace,
    preprocess_text,
)


def test_normalize_line_endings():
    text = "Python\r\nJava\rSQL"

    result = normalize_line_endings(text)

    assert result == "Python\nJava\nSQL"


def test_normalize_bullets():
    text = "• Python\n● Java\n▪ SQL"

    result = normalize_bullets(text)

    assert result == "- Python\n- Java\n- SQL"


def test_normalize_whitespace():
    text = "Python    Java\t\tSQL\n\nMachine Learning"

    result = normalize_whitespace(text)

    assert result == "Python Java SQL Machine Learning"


def test_lowercase_conversion():
    text = "Python Java Machine Learning"

    result = preprocess_text(text)

    assert result == "python java machine learning"


def test_preserve_technical_terms():
    text = "Skills: C++, C#, Node.js, .NET, React.js"

    result = preprocess_text(text)

    assert "c++" in result
    assert "c#" in result
    assert "node.js" in result
    assert ".net" in result
    assert "react.js" in result


def test_preserve_numbers():
    text = "3 years of experience with Python 3.11"

    result = preprocess_text(text)

    assert "3 years" in result
    assert "3.11" in result


def test_remove_control_characters():
    text = "Python\x00 Java\x01 SQL"

    result = preprocess_text(text)

    assert "\x00" not in result
    assert "\x01" not in result
    assert "python" in result
    assert "java" in result
    assert "sql" in result


def test_empty_text():
    assert preprocess_text("") == ""
    assert preprocess_text("   ") == ""


def test_invalid_input():
    with pytest.raises(TypeError):
        preprocess_text(None)


def test_complete_preprocessing_pipeline():
    text = """
    JOHN   SMITH

    • SOFTWARE DEVELOPER

    Skills:
        Python, C++, SQL

    Experience:
    2+ years of experience in Python development.
    """

    result = preprocess_text(text)

    assert "john smith" in result
    assert "software developer" in result
    assert "python" in result
    assert "c++" in result
    assert "sql" in result
    assert "2+ years" in result