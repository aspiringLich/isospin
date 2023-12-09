#!/usr/bin/python

from email.policy import default
from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Dict, List, Optional, Callable, Any

import yaml
import pybars
import markdown
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


class Item(BaseModel):
    id: str
    base: str
    content: Optional[str] = None
    file: Optional[str] = None

    class Config:
        extra = "allow"

    @model_validator(mode="before")
    def log_extra_fields(cls, values):
        extra_fields = set(values.keys()) - Item.__annotations__.keys()
        for field in extra_fields:
            print(f"Extra field detected: {field} with value {values[field]}")
        return values


class Template(BaseModel):
    id: str
    file: str
    mode: Callable[[Item], Item] = Field(...)

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
    templates: Dict[str, Template]
    registry: List[Item]


# parse config
with open("./config.yml", "r") as f:
    config = Config.model_validate(
        yaml.load(f, Loader=yaml.FullLoader), strict=True
    )
    for item in config.registry:
        template = config.templates[item.base]
        item = template.mode(item)

# parse template
with open("./template.hbs", "r") as f:
    template = pybars.Compiler().compile(f.read())
    output = template(config)

    print(output)
