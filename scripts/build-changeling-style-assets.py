"""Build optimized raster ornaments for the Changeling character sheet.

The source PNGs are intentionally kept outside ``public`` so the browser only
downloads the cropped WebP assets.  Pillow is the only required dependency.
"""

from __future__ import annotations

from pathlib import Path
import sys

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "changeling-style" / "source"
OUTPUT = ROOT / "public" / "changeling" / "style"
INK = (23, 56, 35)


def crop_alpha(image: Image.Image, padding: int = 0, alpha_threshold: int = 0) -> Image.Image:
    image = image.convert("RGBA")
    alpha = image.getchannel("A")
    if alpha_threshold:
        alpha = alpha.point(lambda value: value if value >= alpha_threshold else 0)
        image.putalpha(alpha)
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError("Image contains no visible pixels")
    left, top, right, bottom = bbox
    return image.crop(
        (
            max(0, left - padding),
            max(0, top - padding),
            min(image.width, right + padding),
            min(image.height, bottom + padding),
        )
    )


def fit(image: Image.Image, maximum: tuple[int, int]) -> Image.Image:
    image = image.copy()
    image.thumbnail(maximum, Image.Resampling.LANCZOS)
    return image


def extract_green_ink(image: Image.Image) -> Image.Image:
    """Remove the generated checkerboard while retaining green antialiasing."""

    source = image.convert("RGB")
    result = Image.new("RGBA", source.size)
    extracted: list[tuple[int, int, int, int]] = []
    for red, green, blue in source.get_flattened_data():
        chroma = max(0, green - max(red, blue))
        alpha = max(0, min(255, (chroma - 1) * 16))
        if alpha < 64:
            alpha = 0
        extracted.append((*INK, alpha))
    result.putdata(extracted)
    return result


def extract_scanned_green_rule(image: Image.Image) -> Image.Image:
    """Lift a faint green-gray rule from warm paper without flattening its ink."""

    source = image.convert("RGB")
    result = Image.new("RGBA", source.size)
    extracted: list[tuple[int, int, int, int]] = []
    for red, green, blue in source.get_flattened_data():
        darkness = max(0, 225 - ((red + green + blue) // 3))
        alpha = min(255, darkness * 4) if green >= red - 2 and green >= blue + 5 else 0
        if alpha < 24:
            alpha = 0
        extracted.append((*INK, alpha))
    result.putdata(extracted)
    return result


def clean_title(image: Image.Image) -> Image.Image:
    """Discard isolated near-white export specks before calculating its bounds."""

    result = image.convert("RGBA")
    cleaned: list[tuple[int, int, int, int]] = []
    for red, green, blue, alpha in result.get_flattened_data():
        if alpha and red > 180 and green > 180 and blue > 180:
            alpha = 0
        cleaned.append((red, green, blue, alpha))
    result.putdata(cleaned)
    return result


def save_webp(image: Image.Image, name: str) -> None:
    target = OUTPUT / name
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, "WEBP", lossless=True, method=6)
    print(f"{target.relative_to(ROOT)}: {image.width}x{image.height}")


def save_texture_webp(image: Image.Image, name: str) -> None:
    """Save an opaque photographic texture without the cost of lossless WebP."""

    target = OUTPUT / name
    target.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(target, "WEBP", quality=90, method=6)
    print(f"{target.relative_to(ROOT)}: {image.width}x{image.height}")


def build_attribute_divider_assets() -> None:
    """Crop the manually separated pieces used by the Attributes divider."""

    for name in (
        "attributes-divider.webp",
        "attributes-divider-leaf.webp",
    ):
        save_webp(crop_alpha(Image.open(SOURCE / name), padding=6, alpha_threshold=16), name)


def build_kith_skill_assets() -> None:
    """Preserve the four matching pieces used by the measured Kith Skill frame."""

    for source_name, output_name in (
        ("skill-kith-left.webp", "skill-highlight-left.webp"),
        ("skill-kith-middle-1.webp", "skill-highlight-middle-1.webp"),
        ("skill-kith-middle-2.webp", "skill-highlight-middle-2.webp"),
        ("skill-kith-right.webp", "skill-highlight-right.webp"),
    ):
        save_webp(Image.open(SOURCE / source_name).convert("RGBA"), output_name)


def main() -> None:
    if "--attributes-only" in sys.argv:
        build_attribute_divider_assets()
        return
    if "--kith-skill-only" in sys.argv:
        build_kith_skill_assets()
        return

    corner = crop_alpha(Image.open(SOURCE / "botanical-corner.png"), padding=8)
    save_webp(fit(corner, (1024, 1024)), "frame-corner.webp")

    star_source = Image.open(SOURCE / "frame-star.png").convert("RGBA")
    star_center_x = star_source.width // 2

    # Keep the center star and its two adjacent ornaments independent from the
    # extensible rails. Their small line stubs meet the CSS rules, but no rule
    # is ever drawn behind the star itself.
    star = crop_alpha(
        star_source.crop((star_center_x - 116, 195, star_center_x + 116, 525)),
        padding=4,
    )
    save_webp(fit(star, (240, 340)), "frame-center.webp")

    side_left = crop_alpha(
        star_source.crop((star_center_x - 236, 300, star_center_x - 116, 420)),
        padding=4,
    )
    save_webp(fit(side_left, (130, 130)), "frame-side.webp")

    title = crop_alpha(clean_title(Image.open(SOURCE / "changeling-title.png")), padding=8)
    save_webp(fit(title, (1600, 560)), "title.webp")

    paper = fit(Image.open(SOURCE / "changeling-paper-texture-v2.png"), (1024, 1024))
    save_texture_webp(paper, "paper-texture.webp")

    tab_texture = fit(Image.open(SOURCE / "selected-tab-texture.png"), (1280, 320))
    save_texture_webp(tab_texture, "tab-texture.webp")

    build_attribute_divider_assets()
    build_kith_skill_assets()

    terminal = crop_alpha(Image.open(SOURCE / "divider-terminal.webp"), padding=2)
    save_webp(fit(terminal, (180, 180)), "section-divider.webp")

    # This source is a scan of a real inked rule.  Its center section excludes
    # the page-edge flourishes, leaving a repeatable, slightly irregular stroke.
    vertical_source = Image.open(SOURCE / "vertical-rule.png")
    vertical_band = vertical_source.crop((14, 120, 27, 1000))
    vertical_rule = crop_alpha(extract_scanned_green_rule(vertical_band), padding=2)
    save_webp(vertical_rule, "column-divider.webp")

if __name__ == "__main__":
    main()
