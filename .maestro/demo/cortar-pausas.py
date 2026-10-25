#!/usr/bin/env python3
"""Corta os trechos parados de uma gravação: cada pausa fica com no máximo 2 s.

Uso: python3 cortar-pausas.py gravacao-bruta.mp4 video-final.mp4
Gera um mp4 de 720 px de largura e 30 fps. Requer ffmpeg e ffprobe.
"""

import re
import subprocess
import sys

MAX_PAUSE = 2.0  # segundos que cada tela parada continua visível
OPENING_HOLD = 1.5  # quanto da primeira tela fica antes do primeiro movimento
CLOSING_HOLD = 3.0  # quanto da última tela fica depois do último movimento


def duration_of(path: str) -> float:
    result = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path],
        capture_output=True,
        text=True,
        check=True,
    )
    return float(result.stdout)


def frozen_ranges(path: str, total: float) -> list[tuple[float, float]]:
    log = subprocess.run(
        ['ffmpeg', '-i', path, '-vf', 'scale=330:-1,freezedetect=n=0.001:d=2.5', '-an', '-f', 'null', '-'],
        capture_output=True,
        text=True,
    ).stderr
    starts = [float(value) for value in re.findall(r'freeze_start: ([\d.]+)', log)]
    ends = [float(value) for value in re.findall(r'freeze_end: ([\d.]+)', log)]
    # Uma pausa que vai até o fim do vídeo não tem freeze_end.
    ends += [total] * (len(starts) - len(ends))
    return list(zip(starts, ends))


def ranges_to_keep(frozen: list[tuple[float, float]], total: float) -> list[tuple[float, float]]:
    cuts = []
    for start, end in frozen:
        if start < 0.01:
            cuts.append((0.0, max(0.0, end - OPENING_HOLD)))
        elif end >= total - 0.01:
            cuts.append((start + CLOSING_HOLD, total))
        elif end - start > MAX_PAUSE + 0.3:
            cuts.append((start + MAX_PAUSE, end - 0.2))

    keep, cursor = [], 0.0
    for start, end in cuts:
        if start > cursor:
            keep.append((cursor, start))
        cursor = max(cursor, end)
    if cursor < total:
        keep.append((cursor, total))
    return keep


def main() -> None:
    source, target = sys.argv[1], sys.argv[2]
    total = duration_of(source)
    keep = ranges_to_keep(frozen_ranges(source, total), total)
    selection = '+'.join(f'between(t,{start:.2f},{end:.2f})' for start, end in keep)
    subprocess.run(
        [
            'ffmpeg', '-v', 'error', '-y', '-i', source,
            '-vf', f"fps=30,select='{selection}',setpts=N/30/TB,scale=720:-2",
            '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24',
            '-pix_fmt', 'yuv420p', '-movflags', '+faststart', target,
        ],
        check=True,
    )
    final = sum(end - start for start, end in keep)
    print(f'{target}: {total:.0f}s gravados, {final:.0f}s no vídeo final')


if __name__ == '__main__':
    main()
