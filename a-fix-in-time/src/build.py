#!/usr/bin/env python3
"""Builds the self-contained episode and trailer pages for A Fix In Time.

Each episode's story lives in src/epN.js (storyData + window.TRAILER). This joins it with the
shared engine and the page template, and writes episodes/episode-N.html and trailers/trailer-N.html.
Run from anywhere:  python3 a-fix-in-time/src/build.py
"""
import json
import pathlib
import re

SRC = pathlib.Path(__file__).resolve().parent
OUT = SRC.parent
SERIES = 'A Fix In Time'


def read(name):
    return (SRC / name).read_text(encoding='utf-8')


def main():
    page, engine = read('page.html'), read('engine.js')
    runners = {'episode': read('runner-episode.js'), 'trailer': read('runner-trailer.js')}
    (OUT / 'episodes').mkdir(exist_ok=True)
    (OUT / 'trailers').mkdir(exist_ok=True)
    for story_file in sorted(SRC.glob('ep*.js')):
        num = int(re.match(r'ep(\d+)\.js', story_file.name).group(1))
        story = story_file.read_text(encoding='utf-8')
        title = re.search(r"^// TITLE: (.+)$", story, re.M).group(1).strip()
        info = {'series': SERIES, 'num': num, 'title': title, 'startGems': num - 1}
        for kind, folder, label in (('episode', 'episodes', f'Episode {num}: {title} | {SERIES}'),
                                    ('trailer', 'trailers', f'{SERIES} - Episode {num}: {title} · Trailer')):
            html = (page.replace('{{TITLE}}', label)
                        .replace('{{SHOW_INFO}}', json.dumps(info))
                        .replace('{{ENGINE}}', engine)
                        .replace('{{STORY}}', story)
                        .replace('{{RUNNER}}', runners[kind]))
            (OUT / folder / f'{kind}-{num}.html').write_text(html, encoding='utf-8')
            print('built', f'{folder}/{kind}-{num}.html')


if __name__ == '__main__':
    main()
