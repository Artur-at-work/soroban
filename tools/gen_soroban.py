#!/usr/bin/env python3
"""Generate deterministic SVG soroban diagrams from lesson YAML files."""

from __future__ import annotations

import argparse
import html
from pathlib import Path

import yaml


COLORS = {
    "ink": "#172b2a",
    "rod": "#718985",
    "board": "#dce8df",
    "bead": "#d96a42",
    "active": "#8c3928",
    "highlight": "#f2d879",
}


def render_diagram(spec: dict) -> str:
    rods = int(spec.get("rods", 5))
    value = int(spec.get("value", 0))
    if not 1 <= rods <= 12:
        raise ValueError("rods must be between 1 and 12")
    if not 0 <= value < 10**rods:
        raise ValueError(f"value must fit on {rods} rods")

    width = max(300, rods * 62 + 36)
    height = 280
    beam_y = 112
    start_x = (width - (rods - 1) * 62) / 2
    highlight = {int(rod) for rod in spec.get("highlight", [])}
    digits = [int(digit) for digit in str(value).zfill(rods)]
    label = html.escape(str(spec.get("label", "Soroban diagram")), quote=True)
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        f'<title id="title">{label}</title>',
        f'<desc id="desc">Soroban showing the number {value}.</desc>',
        f'<rect x="8" y="8" width="{width - 16}" height="250" rx="5" fill="{COLORS["board"]}" stroke="{COLORS["ink"]}" stroke-width="4"/>',
        f'<line x1="12" y1="{beam_y}" x2="{width - 12}" y2="{beam_y}" stroke="{COLORS["ink"]}" stroke-width="8"/>',
    ]

    for rod, digit in enumerate(digits):
        x = start_x + rod * 62
        if rod in highlight:
            parts.append(f'<rect x="{x - 24:g}" y="15" width="48" height="210" rx="20" fill="{COLORS["highlight"]}" opacity="0.55"/>')
        parts.append(f'<line x1="{x:g}" y1="20" x2="{x:g}" y2="220" stroke="{COLORS["rod"]}" stroke-width="2"/>')
        heaven_active = digit >= 5
        heaven_y = beam_y - 15 if heaven_active else 39
        parts.append(_bead(x, heaven_y, 9, f"Rod {rods - rod} upper bead"))
        earth = digit % 5
        for index in range(4):
            active = index < earth
            y = beam_y + 18 + index * 14 if active else 166 + (index - earth) * 14
            parts.append(_bead(x, y, 8, f"Rod {rods - rod} lower bead {index + 1}"))
        if rod == rods - 1:
            parts.append(f'<circle cx="{x:g}" cy="238" r="3" fill="{COLORS["active"]}"/>')
        place = rods - rod - 1
        place_label = "ones" if place == 0 else "1" + "0" * place
        parts.append(f'<text x="{x:g}" y="270" fill="{COLORS["ink"]}" font-family="sans-serif" font-size="12" text-anchor="middle">{place_label}</text>')

    parts.append("</svg>")
    return "\n".join(parts) + "\n"


def _bead(x: float, y: float, radius: int, label: str) -> str:
    return (
        f'<circle cx="{x:g}" cy="{y:g}" r="{radius}" fill="{COLORS["bead"]}" '
        f'stroke="{COLORS["active"]}" stroke-width="1.5"><title>{label}</title></circle>'
    )


def generate(source: Path, output_dir: Path) -> Path:
    spec = yaml.safe_load(source.read_text(encoding="utf-8")) or {}
    target = output_dir / f"{source.stem}.svg"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(render_diagram(spec), encoding="utf-8")
    return target


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, default=Path("tools/diagrams"))
    parser.add_argument("--output-dir", type=Path, default=Path("assets/img"))
    args = parser.parse_args()
    for source in sorted(args.source_dir.glob("*.yaml")):
        print(generate(source, args.output_dir))


if __name__ == "__main__":
    main()