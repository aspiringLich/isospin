from PIL import Image, ImageOps
import os
import sys

# constants
GRID_SIZE = 59
TOP_LEFT = (53, 167)
BLOCK_SIZE = 10 * GRID_SIZE
PADDING = 25

# check python version
MIN_PYTHON = (3, 10)
if sys.version_info < MIN_PYTHON:
    sys.exit("Python %s.%s or later is required.\n" % MIN_PYTHON)

# set current working dir
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

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
        im = img.crop((
            tlx + bx + PADDING,
            tly + by + PADDING,
            tlx + bx + BLOCK_SIZE - PADDING * 2,
            tly + by + BLOCK_SIZE - PADDING * 2,
        ))
        im = im.convert("RGBA")
        mask = ImageOps.invert(im.convert('L'))
        im.putalpha(mask)

        im.save(f"./{i * 4 + j}.png")
    save(0, 0, 1)
    save(1, 0, 2)
    save(0, 1, 3)
    save(1, 1, 4)
