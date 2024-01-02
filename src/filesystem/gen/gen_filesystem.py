import pybars

import os
import sys

# check python version
MIN_PYTHON = (3, 10)
if sys.version_info < MIN_PYTHON:
    sys.exit("Python %s.%s or later is required.\n" % MIN_PYTHON)

# set current working dir
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)


# read files in /bin
bin = {}
for filename in os.listdir("../root/bin"):
    with open(f"../root/bin/{filename}", "r") as f:
        bin[filename] = f.read()

# read files in /lib
lib = {}
for filename in os.listdir("../root/lib"):
    with open(f"../root/lib/{filename}", "r") as f:
        lib[filename] = f.read()


def sanitize(this, *args):
    return pybars.strlist([args[0].replace("\\", "\\\\").replace("`", "\\`").replace("$", "\\$")])


with open("./template.hbs", "r") as f:
    template = pybars.Compiler().compile(f.read(), )
    output = template({
        "bin": bin,
        "lib": lib
    }, helpers={
        "sanitize": sanitize
    })

with open("../index.ts", "w") as f:
    f.write(output)
