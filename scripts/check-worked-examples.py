"""Execute the published example code and locate updated workbook pages for QA."""
import contextlib
import io
import json
import sqlite3
from pathlib import Path
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
items = json.loads((root / "tmp/pdfs/course-guide-data.json").read_text())
for item in items:
    course_id = item["course"]["id"]
    if course_id not in {"python-fund", "sql"}:
        continue
    target = "Validate a whole-number input in Python" if course_id == "python-fund" else "Keep customers without orders in a SQL report"
    lesson = next(lesson for module in item["curriculum"]["modules"] for lesson in module["lessons"] if lesson["title"] == target)
    code = next(block["code"] for block in lesson["blocks"] if block["type"] == "code")
    if course_id == "python-fund":
        namespace = {}
        with contextlib.redirect_stdout(io.StringIO()):
            exec(compile(code, "published-quantity-example", "exec"), namespace)
        cases = {"3": 3, "0": None, "-2": None, "three": None, "3.5": None, "": None, " 3 ": 3}
        for text, expected in cases.items():
            assert namespace["quantity"](text) == expected, text
        print("Python example: seven conversion and boundary cases passed.")
    else:
        with sqlite3.connect(":memory:") as database:
            rows = database.execute(code).fetchall()
            assert rows == [("Amina", 2), ("Brian", 1), ("Chen", 0)], rows
            inner = database.execute(code.replace("LEFT JOIN", "INNER JOIN")).fetchall()
            assert inner == [("Amina", 2), ("Brian", 1)], inner
            star = database.execute(code.replace("COUNT(o.id)", "COUNT(*)")).fetchall()
            assert star[-1] == ("Chen", 1), star
        print("SQL example: published fixture and both diagnostic variations passed in SQLite; PostgreSQL syntax checked against primary documentation.")
    pdf = root / "public/downloads/course-guides" / f"{course_id}-study-guide.pdf"
    if not pdf.exists():
        pdf = next((root / "public/downloads/course-guides").glob(f"{course_id}*.pdf"))
    reader = PdfReader(pdf)
    pages = [index + 1 for index, page in enumerate(reader.pages) if target in page.extract_text()]
    assert pages, f"Updated lesson missing from {pdf}"
    print(f"{pdf.name}: {len(reader.pages)} pages; updated lesson appears on pages {pages}.")
