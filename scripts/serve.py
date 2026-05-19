#!/usr/bin/env python3
"""Serve the font testbench with a local font-folder API."""

from __future__ import annotations

import html
import json
import mimetypes
import os
import shutil
import sys
import urllib.parse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_FONTS_DIR = Path.home() / "Library" / "Fonts"
FONT_SUFFIXES = {".otf", ".ttf", ".ttc", ".otc", ".woff", ".woff2"}


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
except ImportError as exc:  # pragma: no cover - depends on local environment
    reexec_with_fonttools_python()
    raise SystemExit(
        "Missing dependency: fonttools. Install with `python3 -m pip install -r requirements.txt`, "
        "or install the Homebrew fonttools CLI so `ttx` is available on PATH."
    ) from exc


def name_records(font: TTFont) -> dict[int, str]:
    result: dict[int, str] = {}
    if "name" not in font:
        return result
    for record in font["name"].names:
        if record.nameID not in {1, 2, 4, 6, 17}:
            continue
        try:
            text = record.toUnicode().strip()
        except UnicodeDecodeError:
            continue
        if text and record.nameID not in result:
            result[record.nameID] = text
    return result


def font_weight(font: TTFont, subfamily: str) -> int:
    if "OS/2" in font:
        weight = int(getattr(font["OS/2"], "usWeightClass", 0) or 0)
        if weight:
            return weight

    text = subfamily.lower()
    if "thin" in text:
        return 100
    if "extra light" in text or "extralight" in text or "ultra light" in text:
        return 200
    if "light" in text:
        return 300
    if "medium" in text:
        return 500
    if "semi bold" in text or "semibold" in text or "demi bold" in text:
        return 600
    if "bold" in text:
        return 700
    if "black" in text or "heavy" in text:
        return 900
    return 400


def font_style(subfamily: str) -> str:
    text = subfamily.lower()
    if "italic" in text or "oblique" in text:
        return "italic"
    return "normal"


def cmap_codepoints(font: TTFont) -> set[int]:
    codepoints: set[int] = set()
    if "cmap" not in font:
        return codepoints
    for table in font["cmap"].tables:
        if table.isUnicode():
            codepoints.update(table.cmap.keys())
    return codepoints


def font_rows(path: Path) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []

    def append(font: TTFont, index: int | None = None) -> None:
        names = name_records(font)
        family = names.get(1) or path.stem
        subfamily = names.get(2) or "Regular"
        full_name = names.get(4) or f"{family} {subfamily}".strip()
        rows.append(
            {
                "path": str(path),
                "index": index,
                "file": path.name,
                "family": family,
                "subfamily": subfamily,
                "fullName": full_name,
                "postScriptName": names.get(6) or "",
                "typographicFamily": names.get(16) or family,
                "typographicSubfamily": names.get(17) or subfamily,
                "weight": font_weight(font, subfamily),
                "style": font_style(subfamily),
                "size": path.stat().st_size,
            }
        )

    if path.suffix.lower() in {".ttc", ".otc"}:
        collection = TTCollection(path)
        for index, font in enumerate(collection.fonts):
            append(font, index)
        return rows

    append(TTFont(path, lazy=True))
    return rows


def scan_fonts(directory: Path, recursive: bool = True) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    if not directory.exists() or not directory.is_dir():
        return rows

    paths = directory.rglob("*") if recursive else directory.iterdir()
    for path in sorted(paths):
        if not path.is_file() or path.suffix.lower() not in FONT_SUFFIXES:
            continue
        try:
            rows.extend(font_rows(path))
        except Exception as exc:  # pragma: no cover - depends on user font files
            rows.append({"path": str(path), "file": path.name, "error": str(exc)})

    return rows


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args: object, **kwargs: object) -> None:
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self) -> None:  # noqa: N802 - stdlib hook
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/fonts":
            self.handle_fonts_api(parsed)
            return
        if parsed.path == "/api/coverage":
            self.handle_coverage_api(parsed)
            return
        if parsed.path == "/font":
            self.handle_font_file(parsed)
            return
        if parsed.path == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
            return
        if parsed.path == "/":
            self.path = "/index.html"
        super().do_GET()

    def send_json(self, payload: object, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def handle_fonts_api(self, parsed: urllib.parse.ParseResult) -> None:
        query = urllib.parse.parse_qs(parsed.query)
        directory = Path(query.get("dir", [str(DEFAULT_FONTS_DIR)])[0]).expanduser()
        recursive = query.get("recursive", ["1"])[0] != "0"
        rows = scan_fonts(directory, recursive=recursive)
        self.send_json({"directory": str(directory), "fonts": rows})

    def handle_coverage_api(self, parsed: urllib.parse.ParseResult) -> None:
        query = urllib.parse.parse_qs(parsed.query)
        raw_path = query.get("path", [""])[0]
        path = Path(raw_path).expanduser()
        if not path.is_file() or path.suffix.lower() not in FONT_SUFFIXES:
            self.send_error(404, "Font not found")
            return

        text = query.get("text", [""])[0]
        index_text = query.get("index", [""])[0]
        try:
            if path.suffix.lower() in {".ttc", ".otc"}:
                index = int(index_text or "0")
                collection = TTCollection(path)
                font = collection.fonts[index]
            else:
                font = TTFont(path, lazy=True)
        except (IndexError, ValueError, OSError):
            self.send_error(400, "Cannot read font coverage")
            return

        cmap = cmap_codepoints(font)
        codepoints = sorted({ord(char) for char in text if not char.isspace()})
        missing = [codepoint for codepoint in codepoints if codepoint not in cmap]
        self.send_json(
            {
                "path": str(path),
                "index": index_text,
                "codepoints": codepoints,
                "missingCodepoints": missing,
            }
        )

    def handle_font_file(self, parsed: urllib.parse.ParseResult) -> None:
        query = urllib.parse.parse_qs(parsed.query)
        raw_path = query.get("path", [""])[0]
        path = Path(raw_path).expanduser()
        if not path.is_file() or path.suffix.lower() not in FONT_SUFFIXES:
            self.send_error(404, "Font not found")
            return

        content_type = mimetypes.guess_type(path.name)[0] or "font/otf"
        try:
            data = path.read_bytes()
        except OSError:
            self.send_error(403, "Cannot read font")
            return

        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, format: str, *args: object) -> None:
        safe = html.escape(format % args)
        sys.stderr.write(f"{self.address_string()} - {safe}\n")


def main() -> int:
    port = int(os.environ.get("FONT_TESTBENCH_PORT", "8765"))
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"Font Testbench: http://127.0.0.1:{port}")
    print(f"Default font folder: {DEFAULT_FONTS_DIR}")
    server.serve_forever()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
