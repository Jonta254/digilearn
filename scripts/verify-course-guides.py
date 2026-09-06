"""Verify generated DigiLearn course-guide PDFs."""

from pathlib import Path

from pypdf import PdfReader


GUIDES = Path(__file__).resolve().parents[1] / "public" / "downloads" / "course-guides"


def main() -> None:
    files = sorted(GUIDES.glob("*.pdf"))
    issues: list[str] = []
    page_counts: list[int] = []
    sizes: list[int] = []

    for file in files:
        reader = PdfReader(str(file))
        page_counts.append(len(reader.pages))
        sizes.append(file.stat().st_size)
        for index, page in enumerate(reader.pages, start=1):
            if len((page.extract_text() or "").strip()) < 40:
                issues.append(f"{file.name}: page {index} has too little text")
        first = reader.pages[0]
        width = float(first.mediabox.width)
        height = float(first.mediabox.height)
        if abs(width - 595.2756) > 2 or abs(height - 841.8898) > 2:
            issues.append(f"{file.name}: expected A4, found {width:.1f} x {height:.1f} points")

    if len(files) != 72:
        issues.append(f"expected 72 guides, found {len(files)}")
    if set(page_counts) != {14}:
        issues.append(f"expected 14 pages per guide, found {sorted(set(page_counts))}")
    if min(sizes, default=0) < 20_000:
        issues.append(f"smallest guide is only {min(sizes, default=0)} bytes")

    if issues:
        raise SystemExit("\n".join(issues))

    print(
        f"Verified {len(files)} A4 guides, 14 pages each, "
        f"{min(sizes):,}-{max(sizes):,} bytes, with no empty pages."
    )


if __name__ == "__main__":
    main()
