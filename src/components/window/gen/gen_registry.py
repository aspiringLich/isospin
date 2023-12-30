from pydantic import BaseModel, Field, field_validator, model_validator, computed_field
from typing import Dict, List, Callable, Any, Optional
from colorama import Fore as fg, Style as st

import re
import yaml
import pybars
import markdown
import os
import sys
import json


# global constants
MANDATORY_PROPS = ["title"]


# check python version
MIN_PYTHON = (3, 10)
if sys.version_info < MIN_PYTHON:
    sys.exit("Python %s.%s or later is required.\n" % MIN_PYTHON)

# set current working dir
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)


# globals
ID_SET = set()


class DuplicatedIdError(Exception):
    pass


def pretty_log(kw: str, *args):
    s = f"{fg.GREEN}{kw}{st.RESET_ALL} "
    joined = " ".join(args)
    l = joined.split("|")

    for i in range(1, len(l), 2):
        s += f"{l[i - 1]}{fg.BLACK}{l[i]}{st.RESET_ALL}"
    if len(l) % 2 == 1:
        s += f"{l[-1]}"
    print(s)


def check_uniqueness(id):
    if id in ID_SET:
        raise DuplicatedIdError(f"Duplicate id `{id}`")
    else:
        ID_SET.add(id)


class App(BaseModel):
    icon: str
    row: int


class Item(BaseModel):
    id: str
    base: str
    title: str
    props: Dict[str, Any] = Field(default_factory=dict)
    app: Optional[App] = None
    file: Optional[str] = None

    class Config:
        extra = "allow"

    @model_validator(mode="after")
    def validate_id(self):
        check_uniqueness(self.id)
        return self

    @model_validator(mode="after")
    def log_and_set_props(self):
        props = self.__pydantic_extra__

        if not props:
            after = "no props"
        else:
            after = f"props: |{', '.join(list(props.keys()))}"
            self.props = props

        for prop in MANDATORY_PROPS:
            self.props[prop] = self.__dict__[prop]

        pretty_log("Registered", self.id, f"|({self.base})| w/", after)

        return self


class Template(BaseModel):
    id: str
    file: str
    mode: str

    @model_validator(mode="after")
    def validate_id(self):
        check_uniqueness(self.id)
        return self

    @computed_field
    @property
    def mode_fn(self) -> Callable[[Item], Item]:
        def transform_field(field: str, transform: Callable[[Any], Any]):
            def f(item: Item):
                if getattr(item, field) is not None:
                    setattr(item, field, transform(getattr(item, field)))
                    return item
                else:
                    raise Exception(
                        f"Missing prop `{field}` on item `{item.id}`")
            return f

        def assert_field_exists(field: str):
            def f(item: Item):
                if getattr(item, field) is not None:
                    return item
                else:
                    raise Exception(
                        f"Missing field `{field}` on item `{item.id}`")
            return f

        def prop_transformer(name: str | None):
            match name:
                case "markdown": return markdown.markdown
                case "json": return json.loads
                case None: return lambda i: i
                case _: raise Exception(f"Invalid prop transformer `{name}` on template `{self.id}`")

        def compose(*fns):
            def f(x):
                for fn in fns:
                    x = fn(x)
                return x
            return f

        match self.mode:
            case "component": return assert_field_exists("file")

        # matching: `mode arg1 arg2(v) etc...`
        match_result = re.match(
            r"^([\w_]+) ((?:[\w_]+(?:\([\w_]+\))? *)+)$", self.mode)
        if match_result:
            mode = match_result.group(1)
            args = {
                k: next(iter(v), None)
                for k, *v in [
                    map(str.strip, a.removesuffix(")").split("("))
                    for a in
                    match_result.group(2).split()
                ]
            }

            match mode:
                case "props":
                    return compose(*[transform_field(k, prop_transformer(v))
                                     for k, v in args.items()])

        raise Exception(
            f"Invalid mode `{self.mode}` on template `{self.id}`")


class Config(BaseModel):
    templates: List[Template]
    registry: List[Item]

    @model_validator(mode="after")
    def transform_items(self) -> 'Config':
        templates = {t.id: t for t in self.templates}

        for i, item in enumerate(self.registry):
            template = templates[item.base]
            self.registry[i] = template.mode_fn(item)

            item.props = json.dumps(item.props)  # type: ignore

        return self


# parse config
with open("./config.yml", "r") as f:
    config = Config.model_validate(
        yaml.load(f, Loader=yaml.FullLoader), strict=True
    )

# parse template
with open("./template.hbs", "r") as f:
    template = pybars.Compiler().compile(f.read())
    output = template(config)

with open("../registry.ts", "w") as f:
    f.write(output)
