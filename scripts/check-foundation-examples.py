"""Execute the actual published Python/SQL snippets against their stated results."""
import contextlib
import io
import json
import sqlite3
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
items = json.loads((ROOT / "tmp/pdfs/course-guide-data.json").read_text())
checked = 0
for item in items:
    course_id = item["course"]["id"]
    if course_id not in {"python-fund", "sql"}:
        continue
    lessons = [lesson for module in item["curriculum"]["modules"] for lesson in module["lessons"]]
    assert len(lessons) == 12
    for lesson in lessons:
        snippets = [block for block in lesson["blocks"] if block["type"] == "code"]
        code = snippets[0]["code"]
        expected = next((block["code"] for block in snippets if block["language"] == "text"), None)
        if course_id == "python-fund":
            namespace = {"__name__": "published_example"}
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                exec(compile(code, lesson["id"], "exec"), namespace)
            if "ReorderTests" in namespace:
                suite = unittest.defaultTestLoader.loadTestsFromTestCase(namespace["ReorderTests"])
                result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
                assert result.wasSuccessful() and result.testsRun == 1
                namespace["needs_reorder"] = lambda quantity, threshold: quantity < threshold
                mutated = unittest.defaultTestLoader.loadTestsFromTestCase(namespace["ReorderTests"])
                result = unittest.TextTestRunner(stream=io.StringIO()).run(mutated)
                assert not result.wasSuccessful(), "Boundary test must catch the equality regression"
            elif expected is not None:
                assert output.getvalue().strip() == expected.strip(), (lesson["title"], output.getvalue(), expected)
            else:
                assert "quantity" in namespace
                for value, result in {"3": 3, "0": None, "-2": None, "three": None, "3.5": None, "": None, " 3 ": 3}.items():
                    assert namespace["quantity"](value) == result
            if "reorder_report" in namespace:
                report = namespace["reorder_report"]
                assert report([], 5) == []
                assert report([{"name": "Z", "quantity": 5}, {"name": "A", "quantity": 0}], 5) == ["A", "Z"]
                for invalid in [{"name": "", "quantity": 1}, {"name": "A", "quantity": -1}, {"name": "A", "quantity": True}]:
                    try:
                        report([invalid], 5)
                    except ValueError:
                        pass
                    else:
                        raise AssertionError(f"Accepted invalid record: {invalid}")
        else:
            with sqlite3.connect(":memory:") as db:
                rows = db.execute(code).fetchall()
                if expected is not None:
                    expected_rows = [tuple(cell.strip() for cell in line.split("|")) for line in expected.splitlines()[1:]]
                    actual_rows = [tuple("NULL" if cell is None else str(cell) for cell in row) for row in rows]
                    assert actual_rows == expected_rows, (lesson["title"], actual_rows, expected_rows)
                else:
                    assert rows == [("Amina", 2), ("Brian", 1), ("Chen", 0)]
                    assert db.execute(code.replace("LEFT JOIN", "INNER JOIN")).fetchall() == [("Amina", 2), ("Brian", 1)]
                    assert db.execute(code.replace("COUNT(o.id)", "COUNT(*)")).fetchall()[-1] == ("Chen", 1)
        checked += 1
assert checked == 24, checked
print("Executed 24 published examples: Python outputs, validation boundaries, regression detection, SQL result tables and join diagnostics passed. SQL execution used SQLite, not a PostgreSQL instance.")
