"""Prepare GitHub Pages with versioned local resources; keep source files intact."""
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'dist'
DIRECTORIES = ('contact', 'panneaux', 'photobooth', 'packs', 'livre-or-video', 'galerie', 'images', 'videos')
ASSET_URL = re.compile(r'''(?P<quote>["'])(?P<url>/(?!/)[^"'\r\n<>]*?\.(?:css|js|jpg|jpeg|png|svg|webp|gif|ico|mp4|webm)(?:\?[^"'\r\n<>]*)?)(?P=quote)''', re.I)


def version_url(match, version):
    parts = urlsplit(match['url'])
    query = [(key, value) for key, value in parse_qsl(parts.query) if key != 'v']
    query.append(('v', version))
    url = urlunsplit(('', '', parts.path, urlencode(query), parts.fragment))
    return match['quote'] + url + match['quote']


def build():
    # Fixed output path: never delete source files or copy repository metadata.
    if OUTPUT.is_symlink() or OUTPUT.resolve() != ROOT.resolve() / 'dist':
        raise ValueError('Output must remain inside the project dist directory')
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()
    for source in ROOT.iterdir():
        if source.is_file() and (source.suffix in ('.html', '.css', '.js') or source.name == 'CNAME'):
            shutil.copy2(source, OUTPUT / source.name)
    for name in DIRECTORIES:
        if (ROOT / name).is_dir():
            shutil.copytree(ROOT / name, OUTPUT / name)
    version = os.environ.get('GITHUB_SHA')
    if not version:
        digest = hashlib.sha256()
        for file in sorted(OUTPUT.rglob('*')):
            if file.is_file():
                digest.update(file.relative_to(OUTPUT).as_posix().encode())
                with file.open('rb') as stream:
                    for chunk in iter(lambda: stream.read(1024 * 1024), b''):
                        digest.update(chunk)
        version = digest.hexdigest()
    version = version[:16]
    if not re.fullmatch(r'[a-f0-9]{16}', version):
        raise ValueError('Invalid deployment version')
    for file in OUTPUT.rglob('*'):
        if file.suffix not in ('.html', '.css', '.js'):
            continue
        content = file.read_text(encoding='utf-8')
        content = ASSET_URL.sub(lambda match: version_url(match, version), content)
        if file.suffix == '.html' and '</head>' in content:
            content = content.replace('</head>', f'  <meta name="cascado-version" content="{version}" />\n  <script src="/site-update.js?v={version}" defer></script>\n</head>')
        file.write_text(content, encoding='utf-8')
    shutil.copy2(ROOT / 'scripts' / 'site-update.js', OUTPUT / 'site-update.js')
    (OUTPUT / 'site-version.json').write_text(json.dumps({'version': version}), encoding='utf-8')
    (OUTPUT / '.nojekyll').touch()
    print(f'GitHub Pages ready: {version} ({OUTPUT})')


if __name__ == '__main__':
    build()
