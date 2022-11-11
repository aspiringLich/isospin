use afire::prelude::*;
use afire::{Content, Response};

use chrono::{DateTime, Local};
use std::fs;

use crate::config::{self};
use crate::file::need_rebuild;
use crate::routes::md::parse_md;

#[path = "header.rs"]
mod header;

use super::html::{get_template, rebuild_html_template};
use super::md::OPTIONS;

#[derive(Default, Debug)]
struct FrontMatter {
    title: String,
    description: String,
}

impl FrontMatter {
    fn new(path: &str) -> Self {
        let buf = &fs::read_to_string(path).expect("can read path of file");
        let delimiter = &OPTIONS
            .extension
            .front_matter_delimiter
            .as_ref()
            .expect("valid delimiter in options");

        // strip extraneous whitespace
        let strip_whitespace = |string: &str| {
            let mut split = string.split_whitespace();
            let first = split.next().expect("string not empty").to_owned();
            split.fold(first, |acc, x| acc + " " + x)
        };

        let front_matter = buf
            // split by line endings
            .split(|ch| ch == '\n' || ch == '\r')
            // remove empty lines
            .filter(|line| !line.is_empty())
            // skip until delimiter line
            .skip_while(|&line| line != **delimiter)
            .skip(1)
            // get until ending of delimiter line
            .take_while(|&line| line != **delimiter)
            // turn "title: whatever" -> ("title","whatever")
            .map(|line| line.split_once(':').expect("colon in front matter lines"))
            .map(|(key, value)| (strip_whitespace(key), strip_whitespace(value)));

        let mut out = FrontMatter::default();
        for (key, value) in front_matter {
            let valid_key_values = [
                ("title", &mut out.title),
                ("description", &mut out.description),
            ];
            // find the most similar string and set it
            let ret = valid_key_values.into_iter().find(|x| x.0 == key);
            // if its not exactly equal tho warn
            if let Some((_, field)) = ret {
                *field = value;
            } else {
                eprintln!(
                    "possible misspelling in {} front matter header: {}",
                    path, key
                )
            }
        }
        out
    }
}

fn blog_item(path: String) -> String {
    let preview = FrontMatter::new(&path);
    let time: DateTime<Local> = DateTime::from(fs::metadata(&path).unwrap().created().unwrap());
    format!(
        r#"<div id="preview"><div id="t">
            [{}] Viewing {}
        </div><div id="h">{}</div><div id="p">{}</div></div>"#,
        // ""title"" stuff
        time.format("%c"),
        path,
        // actual content thingies
        preview.title,
        preview.description,
    )
}

fn build_blog(template: String) -> String {
    let mut blog = "".to_string();

    // get all the file paths
    let mut paths = std::fs::read_dir(config::ARTICLE_DIR)
        .expect("article_dir should exist")
        .map(|x| {
            let item = x.ok()?;
            let name = item.file_name();
            let name = name.as_os_str().to_str()?;
            Some(format!("{}/{}", config::ARTICLE_DIR, name))
        })
        // filter out all the nones
        .filter_map(|x| x)
        .array_chunks();

    while let Some([a, b]) = paths.next() {
        blog += &format!(
            r#"<div id="preview-wrapper">{}{}</div>"#,
            blog_item(a),
            blog_item(b)
        );
    }
    let rem = paths.into_remainder();
    if let Some(odd) = rem.unwrap().as_slice().get(0) {
        blog += &format!(
            r#"<div id="preview-wrapper">{}</div>"#,
            blog_item(odd.clone())
        );
    }

    template.replacen("{{CONTENT}}", &blog, 1)
}

/// route for `/blog`, goes to my archive of schizophrenic rambling
pub fn attach(server: &mut Server) {
    // home screen
    server.route(Method::GET, "/blog", |_req| {
        let template = header::generate_header();
        // do any of the md files need rebuilding? (basically)
        let rebuild = {
            let mut ret = false;
            let paths = std::fs::read_dir(config::ARTICLE_DIR).expect("article_dir should exist");
            for path in paths {
                let item = path
                    .expect("can read from the files we scanned for")
                    .file_name();
                let name = item
                    .as_os_str()
                    .to_str()
                    .expect("successful conversion to str");

                let fin = format!("{}/{}", config::ARTICLE_DIR, name);
                let fout = format!("{}/{}", config::ARTICLE_OUT_DIR, name);

                if parse_md(&fin, &fout) {
                    ret = true;
                }
            }
            ret
        };

        let content = if rebuild {
            rebuild_html_template("/blog.html", build_blog)
        } else {
            get_template("/blog.html", build_blog)
        };

        Response::new()
            .text(template.replacen("{{CONTENT}}", &content, 1))
            .content(Content::HTML)
    });
}
