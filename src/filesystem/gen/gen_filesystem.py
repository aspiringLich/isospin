from pybars import strlist
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


def sanitize(s: str):
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("$", "\\$")

# recursively add files in ../root to a file tree


output = strlist()


def read_file_tree(path: str):
    output.append("{")
    for root, dirs, files in os.walk(path):
        for file in files:
            file_path = os.path.join(root, file)
            with open(file_path, "r") as f:
                output.append(f'"{file}": `{sanitize(f.read())}`\n,')
        for dir in dirs:
            dir_path = os.path.join(root, dir)
            output.append(f'"{dir}": ')
            read_file_tree(dir_path)
    output.append("},\r\n")


read_file_tree("../root")

output[-1] = "};"


with open("./template.hbs", "r") as f:
    template = pybars.Compiler().compile(f.read(), )
    output = template({
        "tree": "".join(output)
    })

with open("../index.ts", "w") as f:
    f.write(output)
