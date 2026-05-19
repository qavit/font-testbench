#!/usr/bin/env python3
"""Generate cmap coverage reports for fonts against sample text files."""

from __future__ import annotations

import argparse
import csv
import html
import os
import shutil
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

def reexec_with_fonttools_python() -> None:
    if os.environ.get("FONT_TESTBENCH_REEXEC"):
        return

    for tool_name in ("fonttools", "ttx"):
        tool_path = shutil.which(tool_name)
        if not tool_path:
            continue
        try:
            first_line = Path(tool_path).read_text(encoding="utf-8").splitlines()[0]
        except (OSError, IndexError, UnicodeDecodeError):
            continue
        if not first_line.startswith("#!") or "python" not in first_line.lower():
            continue

        python_path = first_line[2:].strip().split()[0]
        if not Path(python_path).exists():
            continue

        env = os.environ.copy()
        env["FONT_TESTBENCH_REEXEC"] = "1"
        os.execve(python_path, [python_path, *sys.argv], env)


try:
    from fontTools.ttLib import TTCollection, TTFont
except ImportError as exc:  # pragma: no cover - exercised by users without deps
    reexec_with_fonttools_python()
    raise SystemExit(
        "Missing dependency: fonttools. Install with `python3 -m pip install -r requirements.txt`, "
        "or install the Homebrew fonttools CLI so `ttx` is available on PATH."
    ) from exc


FONT_SUFFIXES = {".otf", ".ttf", ".ttc", ".otc", ".woff", ".woff2"}
USER_FONTS_DIR = Path.home() / "Library" / "Fonts"


@dataclass(frozen=True)
class FontRecord:
    path: Path
    label: str
    cmap: frozenset[int]


@dataclass(frozen=True)
class SampleChar:
    char: str
    sample: str
    codepoint: int
    name: str
    category: str


def rough_category(codepoint: int) -> str:
    if 0x3400 <= codepoint <= 0x4DBF:
        return "CJK Extension A"
    if 0x4E00 <= codepoint <= 0x9FFF:
        return "CJK Unified Ideographs"
    if 0x20000 <= codepoint <= 0x2A6DF:
        return "CJK Extension B"
    if 0x2A700 <= codepoint <= 0x2B73F:
        return "CJK Extension C"
    if 0x2B740 <= codepoint <= 0x2B81F:
        return "CJK Extension D"
    if 0x2B820 <= codepoint <= 0x2CEAF:
        return "CJK Extension E/F"
    if 0x2CEB0 <= codepoint <= 0x2EBEF:
        return "CJK Extension F/I"
    if 0x3000 <= codepoint <= 0x303F:
        return "CJK Symbols and Punctuation"
    if 0x3100 <= codepoint <= 0x312F:
        return "Bopomofo"
    if 0x31A0 <= codepoint <= 0x31BF:
        return "Bopomofo Extended"
    if 0x0250 <= codepoint <= 0x02AF:
        return "IPA Extensions"
    if 0x02B0 <= codepoint <= 0x02FF:
        return "Spacing Modifier Letters"
    if 0x0300 <= codepoint <= 0x036F:
        return "Combining Diacritical Marks"
    if 0x1D00 <= codepoint <= 0x1D7F:
        return "Phonetic Extensions"
    if 0x2070 <= codepoint <= 0x209F:
        return "Superscripts and Subscripts"
    if 0x0000 <= codepoint <= 0x007F:
        return "Basic Latin"
    if 0x0080 <= codepoint <= 0x00FF:
        return "Latin-1 Supplement"
    if 0x0100 <= codepoint <= 0x017F:
        return "Latin Extended-A"
    if 0x0180 <= codepoint <= 0x024F:
        return "Latin Extended-B"
    return "Other"


def font_name(font: TTFont, fallback: str) -> str:
    names = font["name"].names if "name" in font else []
    candidates: dict[int, str] = {}
    for record in names:
        if record.nameID not in {1, 2, 4, 6}:
            continue
        try:
            text = record.toUnicode().strip()
        except UnicodeDecodeError:
            continue
        if text:
            candidates.setdefault(record.nameID, text)
    return candidates.get(4) or " ".join(
        part for part in [candidates.get(1), candidates.get(2)] if part
    ) or fallback


def cmap_codepoints(font: TTFont) -> frozenset[int]:
    codepoints: set[int] = set()
    if "cmap" not in font:
        return frozenset()
    for table in font["cmap"].tables:
        if table.isUnicode():
            codepoints.update(table.cmap.keys())
    return frozenset(codepoints)


def load_font_records(path: Path) -> list[FontRecord]:
    if path.suffix.lower() in {".ttc", ".otc"}:
        collection = TTCollection(path)
        records = []
        for index, font in enumerate(collection.fonts):
            label = f"{font_name(font, path.stem)} [{index}]"
            records.append(FontRecord(path, label, cmap_codepoints(font)))
        return records

    font = TTFont(path, lazy=True)
    return [FontRecord(path, font_name(font, path.stem), cmap_codepoints(font))]


def discover_fonts(fonts_dirs: Iterable[Path], font_files: Iterable[Path]) -> list[Path]:
    paths: list[Path] = []

    for fonts_dir in fonts_dirs:
        if not fonts_dir.exists():
            print(f"Skipping missing font directory: {fonts_dir}", file=sys.stderr)
            continue
        paths.extend(
            path
            for path in fonts_dir.rglob("*")
            if path.is_file() and path.suffix.lower() in FONT_SUFFIXES
        )

    for font_file in font_files:
        if not font_file.exists():
            print(f"Skipping missing font file: {font_file}", file=sys.stderr)
            continue
        if font_file.is_file() and font_file.suffix.lower() in FONT_SUFFIXES:
            paths.append(font_file)

    deduped: dict[Path, Path] = {}
    for path in paths:
        try:
            key = path.resolve()
        except OSError:
            key = path
        deduped[key] = path

    return sorted(deduped.values())


def collect_sample_chars(samples_dir: Path) -> list[SampleChar]:
    seen: set[tuple[str, str]] = set()
    chars: list[SampleChar] = []

    for sample_path in sorted(samples_dir.glob("*.txt")):
        text = sample_path.read_text(encoding="utf-8")
        sample = sample_path.stem
        for char in text:
            if char.isspace():
                continue
            key = (sample, char)
            if key in seen:
                continue
            seen.add(key)
            codepoint = ord(char)
            chars.append(
                SampleChar(
                    char=char,
                    sample=sample,
                    codepoint=codepoint,
                    name=unicodedata.name(char, "UNKNOWN"),
                    category=rough_category(codepoint),
                )
            )
    return chars


def rows(fonts: Iterable[FontRecord], chars: Iterable[SampleChar]) -> list[dict[str, str]]:
    result = []
    for font in fonts:
        for item in chars:
            result.append(
                {
                    "font": font.label,
                    "font_file": str(font.path),
                    "sample": item.sample,
                    "char": item.char,
                    "codepoint": f"U+{item.codepoint:04X}",
                    "name": item.name,
                    "category": item.category,
                    "supported": "true" if item.codepoint in font.cmap else "false",
                }
            )
    return result


def write_csv(path: Path, data: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fields = ["font", "font_file", "sample", "char", "codepoint", "name", "category", "supported"]
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(data)


def write_html(path: Path, fonts: list[FontRecord], chars: list[SampleChar], data: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    supported = {
        (row["font"], row["sample"], row["char"]): row["supported"] == "true"
        for row in data
    }
    totals = []
    for font in fonts:
        ok_count = sum(1 for item in chars if supported[(font.label, item.sample, item.char)])
        totals.append((font, ok_count, len(chars)))

    font_headers = "\n".join(
        f"<th>{html.escape(font.label)}<br><small>{ok}/{total}</small></th>"
        for font, ok, total in totals
    )

    body_rows = []
    for item in chars:
        cells = []
        for font in fonts:
            ok = supported[(font.label, item.sample, item.char)]
            cells.append(f'<td class="{"ok" if ok else "miss"}">{"✓" if ok else "×"}</td>')
        body_rows.append(
            "<tr>"
            f"<td>{html.escape(item.sample)}</td>"
            f"<td class=\"char\">{html.escape(item.char)}</td>"
            f"<td>U+{item.codepoint:04X}</td>"
            f"<td>{html.escape(item.category)}</td>"
            f"<td>{html.escape(item.name)}</td>"
            + "".join(cells)
            + "</tr>"
        )

    document = f"""<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Font Coverage Report</title>
<style>
body {{
  margin: 0;
  color: #1d2329;
  background: #f6f7f8;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}}
header {{
  padding: 18px 24px;
  background: #fff;
  border-bottom: 1px solid #d7dde3;
}}
h1 {{
  margin: 0;
  font-size: 28px;
  letter-spacing: 0;
}}
main {{
  padding: 18px 24px 28px;
  overflow-x: auto;
}}
table {{
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #d7dde3;
}}
th,
td {{
  border: 1px solid #d7dde3;
  padding: 7px 9px;
  text-align: left;
  vertical-align: top;
  font-size: 14px;
}}
th {{
  position: sticky;
  top: 0;
  background: #eef2f4;
  z-index: 1;
}}
small {{
  color: #5d6875;
  font-weight: 500;
}}
.char {{
  font-size: 24px;
  line-height: 1;
  text-align: center;
}}
.ok {{
  color: #116d3a;
  text-align: center;
  font-weight: 800;
}}
.miss {{
  color: #a02d2d;
  text-align: center;
  font-weight: 800;
}}
</style>
</head>
<body>
<header><h1>Font Coverage Report</h1></header>
<main>
<table>
<thead>
<tr>
<th>Sample</th>
<th>Char</th>
<th>Codepoint</th>
<th>Category</th>
<th>Name</th>
{font_headers}
</tr>
</thead>
<tbody>
{''.join(body_rows)}
</tbody>
</table>
</main>
</body>
</html>
"""
    path.write_text(document, encoding="utf-8")


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--fonts-dir",
        type=Path,
        action="append",
        help="Directory to scan for font files. May be passed multiple times. Defaults to ./fonts.",
    )
    parser.add_argument(
        "--font-file",
        type=Path,
        action="append",
        default=[],
        help="Single font file to include. May be passed multiple times.",
    )
    parser.add_argument(
        "--user-fonts",
        action="store_true",
        help=f"Also scan the current user's font directory: {USER_FONTS_DIR}",
    )
    parser.add_argument("--samples-dir", type=Path, default=Path("samples"))
    parser.add_argument("--out-csv", type=Path, default=Path("reports/coverage.csv"))
    parser.add_argument("--out-html", type=Path, default=Path("reports/coverage.html"))
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    fonts_dirs = args.fonts_dir or [Path("fonts")]
    if args.user_fonts:
        fonts_dirs.append(USER_FONTS_DIR)

    font_paths = discover_fonts(fonts_dirs, args.font_file)
    if not font_paths:
        checked = ", ".join(str(path) for path in fonts_dirs)
        print(f"No fonts found in: {checked}. Add .otf/.ttf/.ttc files first.", file=sys.stderr)
        return 2

    chars = collect_sample_chars(args.samples_dir)
    if not chars:
        print(f"No sample characters found in {args.samples_dir}.", file=sys.stderr)
        return 2

    fonts: list[FontRecord] = []
    for path in font_paths:
        try:
            fonts.extend(load_font_records(path))
        except Exception as exc:  # pragma: no cover - font parsing depends on user files
            print(f"Skipping {path}: {exc}", file=sys.stderr)

    if not fonts:
        print("No readable fonts found.", file=sys.stderr)
        return 2

    data = rows(fonts, chars)
    write_csv(args.out_csv, data)
    write_html(args.out_html, fonts, chars, data)
    print(f"Wrote {args.out_csv}")
    print(f"Wrote {args.out_html}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
