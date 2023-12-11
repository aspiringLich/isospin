from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Dict, List, Optional, Callable, Any
from colorama import Fore as fg, Style as st

import yaml
import pybars
import markdown
import os
import sys
import json

ID_SET = set()
MANDATORY_PROPS = ["title"]

# check python version
MIN_PYTHON = (3, 10)
if sys.version_info < MIN_PYTHON:
    sys.exit("Python %s.%s or later is required.\n" % MIN_PYTHON)

# set current working dir
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)


def check_uniqueness(id):
    if id in ID_SET:
        raise DuplicatedIdError(f"Duplicate id `{id}`")
    else:
        ID_SET.add(id)


class DuplicatedIdError(Exception):
    pass


class Item(BaseModel):
    id: str
    base: str
    title: str
    props: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        extra = "allow"

    @model_validator(mode="after")
    def validate_id(self):
        check_uniqueness(self.id)
        return self

    @model_validator(mode="after")
    def log(self):
        g = fg.GREEN
        r = st.RESET_ALL
        b = fg.BLACK
        props = self.__pydantic_extra__

        if not props:
            after = "no props"
        else:
            after = f"props: {b}{', '.join(list(props.keys()))}{r}"
            self.props = props
        for prop in MANDATORY_PROPS:
            self.props[prop] = self.__dict__[prop]
        print(f"{g}Registered{r} {self.id} {b}({self.base}){r} w/ {after}")

        return self


class Template(BaseModel):
    id: str
    file: str
    mode: Callable[[Item], Item] = Field(...)

    @model_validator(mode="after")
    def validate_id(self):
        check_uniqueness(self.id)
        return self

    @field_validator("mode", mode="before")
    def convert_mode(cls, v: str):
        def transform_field(field: str, transform: Callable[[Any], Any]):
            def f(item: Item):
                if getattr(item, field) is not None:
                    setattr(item, field, transform(getattr(item, field)))
                    return item
                else:
                    raise Exception(f"Missing {field} on item {item.id}")
            return f
        match v:
            case "content(markdown)":
                return transform_field("content", markdown.markdown)
            case "child_component": return lambda i: i
            case _:
                raise Exception(
                    f"Invalid mode {v} on template {cls.file}")


class Config(BaseModel):
    templates: List[Template]
    registry: List[Item]

    @model_validator(mode="after")
    def transform_items(self) -> 'Config':
        templates = {t.id: t for t in self.templates}

        for i, item in enumerate(self.registry):
            template = templates[item.base]
            self.registry[i] = template.mode(item)

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

with open("./registry.ts", "w") as f:
    f.write(output)
