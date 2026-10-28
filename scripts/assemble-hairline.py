"""Assemble frames created by `node hairline/export-figure.cjs <name>` into GIFs."""
from pathlib import Path
import json
import sys
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
names = sys.argv[1:] or ['documents', 'server-kit']
for name in names:
    for theme in ['light', 'dark']:
        folder = ROOT / 'hairline' / 'frames' / name / theme
        frames = [Image.open(f).convert('RGB') for f in sorted(folder.glob('*.png'))]
        if len(frames) != 100:
            raise ValueError(f'{name}/{theme}: expected 100 frames, got {len(frames)}')
        states = json.loads((folder / 'states.json').read_text())
        assert states[0]['read'] == states[-1]['read'] == 'rest'
        assert len({s['read'] for s in states}) >= 4
        target = ROOT / 'assets' / f'{name}-{theme}.gif'
        frames[0].save(target, save_all=True, append_images=frames[1:], duration=100, loop=0, optimize=True)
        with Image.open(target) as gif:
            assert gif.n_frames > 1 and gif.info['loop'] == 0
            duration = 0
            for i in range(gif.n_frames):
                gif.seek(i)
                duration += gif.info.get('duration', 0)
            assert duration == 10000
            print(f'{target.name}: {gif.n_frames} distinct frames, {duration}ms, {target.stat().st_size} bytes')
