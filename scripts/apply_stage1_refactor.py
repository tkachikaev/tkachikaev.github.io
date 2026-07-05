from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def replace_once(text: str, pattern: str, replacement: str, *, flags: int = re.S) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise RuntimeError(f"Expected one replacement for pattern: {pattern[:60]}")
    return updated


def update_home(filename: str, language: str) -> None:
    path = ROOT / filename
    text = path.read_text(encoding="utf-8")

    if "css/project-modal.css" not in text:
        text = replace_once(
            text,
            r"\s*<style>\s*\.project-card \{.*?</style>",
            '\n  <link rel="stylesheet" href="css/project-modal.css?v=1">\n  <link rel="stylesheet" href="css/hero-art-cta.css?v=1">',
        )

    if "hero-art-cta" not in text:
        href = "bubi-en.html" if language == "en" else "bubi.html"
        label = "Learn more about Bubi" if language == "en" else "Подробнее о Bubi"
        text = replace_once(
            text,
            r'(<figure class="hero-art reveal delay-1">.*?<figcaption>.*?</figcaption>)(</figure>)',
            rf'\1<a class="hero-art-cta" href="{href}"><span>{label}</span><b aria-hidden="true">→</b></a>\2',
        )

    if 'src="js/project-modal.js' not in text:
        text = replace_once(
            text,
            r"\s*<script>\s*\(\(\) => \{ const modal = document\.getElementById\(\"project-modal\"\).*?</script>",
            '\n  <script src="js/project-modal.js?v=1"></script>',
        )

    path.write_text(text, encoding="utf-8")


def update_bubi(filename: str) -> None:
    path = ROOT / filename
    text = path.read_text(encoding="utf-8")

    if 'src="js/enemy-preview.js' not in text:
        text = replace_once(
            text,
            r"\s*<script>\s*// Enemy animation previews.*?</script>",
            '\n  <script src="js/enemy-preview.js?v=1"></script>',
        )

    path.write_text(text, encoding="utf-8")


def update_main_script() -> None:
    path = ROOT / "js" / "main.js"
    text = path.read_text(encoding="utf-8")
    text = re.sub(
        r'\nconst heroArt = document\.querySelector\("\.hero-art"\);\n.*\Z',
        "\n",
        text,
        flags=re.S,
    )
    path.write_text(text, encoding="utf-8")


update_home("index.html", "ru")
update_home("en.html", "en")
update_bubi("bubi.html")
update_bubi("bubi-en.html")
update_main_script()

# This script and its one-time workflow must not remain in the site repository.
Path(__file__).unlink()
workflow = ROOT / ".github" / "workflows" / "apply-stage1-refactor.yml"
workflow.unlink()
