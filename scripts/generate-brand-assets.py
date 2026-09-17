#!/usr/bin/env python3
"""
Generate the 2DU brand assets from one definition.

Writes public/favicon.svg and the PNG set public/manifest.json declares. The
geometry matches src/components/ui/Logo.tsx, so the tab icon, the installed
app icon and the in-app mark stay the same mark - change the constants below
and re-run rather than editing the generated files.

    python3 scripts/generate-brand-assets.py

Requires Pillow. Anything written here is committed; the build never runs it.
"""

import os
from PIL import Image, ImageDraw, ImageFont

# Keep in sync with colors.brand.accent in src/styles/theme.ts.
ACCENT = "#5B7A9E"
INK = "#FFFFFF"
SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

PUBLIC = os.path.join(os.path.dirname(__file__), "..", "public")
ICONS = os.path.join(PUBLIC, "icons")

# The SVG names the app's own stack. Pillow cannot use a CSS stack, so the PNGs
# fall back to whichever of these bold grotesques the machine has - close
# enough at icon sizes, where the tile and colour carry recognition.
FONT_CANDIDATES = [
    "C:/Windows/Fonts/segoeuib.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]

SVG = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="2DU">
  <rect width="64" height="64" rx="14" fill="{ACCENT}"/>
  <text x="32" y="33" text-anchor="middle" dominant-baseline="central"
        fill="{INK}" font-family="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        font-size="21" font-weight="800" letter-spacing="-1">2DU</text>
</svg>
"""


def load_font(size):
    for candidate in FONT_CANDIDATES:
        if os.path.exists(candidate):
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def draw_icon(size):
    """One tile at `size` px: accent ground, rounded corners, centred wordmark."""
    scale = 4  # supersample, then downscale, so the corners and type stay clean
    canvas = size * scale
    image = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    radius = round(canvas * 14 / 64)  # rx=14 at the SVG's 64-unit viewBox
    draw.rounded_rectangle([(0, 0), (canvas - 1, canvas - 1)], radius=radius, fill=ACCENT)

    font = load_font(round(canvas * 21 / 64))
    left, top, right, bottom = draw.textbbox((0, 0), "2DU", font=font)
    draw.text(
        ((canvas - (right + left)) / 2, (canvas - (bottom + top)) / 2),
        "2DU",
        font=font,
        fill=INK,
    )

    return image.resize((size, size), Image.LANCZOS)


def main():
    with open(os.path.join(PUBLIC, "favicon.svg"), "w", encoding="utf-8") as handle:
        handle.write(SVG)
    print("  favicon.svg")

    os.makedirs(ICONS, exist_ok=True)
    for size in SIZES:
        path = os.path.join(ICONS, f"icon-{size}x{size}.png")
        draw_icon(size).save(path, "PNG", optimize=True)
        print(f"  icons/icon-{size}x{size}.png")


if __name__ == "__main__":
    main()
