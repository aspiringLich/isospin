#! /usr/bin/env python3

from PIL import Image
import numpy as np
import os

GRID_SIZE = 59
TOP_LEFT = (53, 167)
BLOCK_SIZE = 10 * GRID_SIZE
PADDING = 25

# set current working dir
path = "src/lib/post-it".split("/")
current = os.getcwd().split("/")[-1]
try:
    idx = path.index(current) + 1
except ValueError:
    idx = 0
os.chdir("/".join(path[idx:]))

# delete every png file in current dir
files = os.listdir(".")
for file in files:
    if file.endswith(".png"):
        os.remove(file)

print()
# for every image in /raw
images = os.listdir("./raw")
for (i, img) in enumerate(images):
    print(f"\x1b[1A\rProcessing image {i+1}/{len(images)}")
    img = Image.open("./raw/" + img)

    def save(x, y, j):
        (tlx, tly) = TOP_LEFT
        (bx, by) = (x * BLOCK_SIZE, y * BLOCK_SIZE)
        section = img.crop((
            tlx + bx + PADDING,
            tly + by + PADDING,
            tlx + bx + BLOCK_SIZE - PADDING * 2,
            tly + by + BLOCK_SIZE - PADDING * 2,
        ))
        section.save(f"./{i * 4 + j}.png")
    save(0, 0, 0)
    save(1, 0, 1)
    save(0, 1, 2)
    save(1, 1, 3)
