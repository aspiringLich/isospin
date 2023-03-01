use afire::prelude::*;
use afire::{Content, Response};

use chrono::{DateTime, Local};
use std::default::default;
use std::fs;

use crate::config::{self};
use crate::file::{need_rebuild, PathMethods};
use crate::{info, warn};

#[path = "header.rs"]
mod header;

use super::html::{get_template, rebuild_html_template};
use super::md::OPTIONS;

#[derive(Default, Debug)]
pub struct FrontMatter {
    pub title: String,
    pub description: String,
    pub head: String,
}

impl FrontMatter {
    /// build an instance of FrontMatter off of a md file's frontmatter header
    ///
    /// ```
    /// FrontMatter::new("./media/article/test.md");
    /// ```
    pub fn new(path: &str) -> Self {
        info! {
            "Parsing frontmatter header for ".blue(),
            path.yellow()
        };

        let buf = &fs::read_to_string(path).expect(&format!("can read path of file: {}", path));
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

        let mut front_matter = buf
            // split by line endings
            .split(|ch| ch == '\n' || ch == '\r')
            // remove empty lines
            .filter(|line| !line.is_empty())
            // skip until delimiter line
            .skip_while(|&line| line != **delimiter)
            .skip(1)
            // get until ending of delimiter line
            .take_while(|&line| line != **delimiter);

        // turn "title: whatever" -> ("title","whatever")
        // OR: turn
        // title: {
        //      we do a little gaming
        //      etc
        //  }
        // into: ("title", "we do a little gaming\netc")
        let mut pairs = vec![];
        while let Some(line) = front_matter.next() {
            let (key, value) = line.split_once(':').expect("colon in front matter lines");
            let key = strip_whitespace(key);
            let mut value = strip_whitespace(value);

            // multi line start thing start
            if value == "{" {
                value = default();
                while let Some(line) = front_matter.next() {
                    let line = strip_whitespace(line);
                    if line == "}" {
                        break;
                    }
                    value = value + &line + "\n";
                }
            };
            pairs.push((key, value));
        }

        let mut out = FrontMatter::default();
        for (key, value) in pairs {
            let valid_key_values = [
                ("title", &mut out.title),
                ("description", &mut out.description),
                ("head", &mut out.head),
            ];
            // find the most similar string and set it
            let ret = valid_key_values.into_iter().find(|x| x.0 == key);
            // if its not exactly equal tho warn
            if let Some((_, field)) = ret {
                *field = value;
            } else {
                warn! {
                    "While building /home.html: ".yellow(),
                    format!("possible misspelling in {} front matter header: {}", key, path)
                };
            }
        }
        out
    }
}

fn blog_item(path: String) -> String {
    let preview = FrontMatter::new(&path);
    // dbg!(&preview);
    let time: DateTime<Local> = DateTime::from(fs::metadata(&path).unwrap().created().unwrap());
    format!(
        r#"
<a id="preview" href="/article/{}"><div id="t">
    [{}] Viewing {}
    </div><div id="h">{}</div>
    <div id="p">{}</div>
</a>"#,
        // link
        path.split('/').last().unwrap().to_string().strip_filetype(),
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
    server.route(Method::GET, "blog", |_req| {
        // do any of the md files need rebuilding? (basically)
        let rebuild = {
            let mut ret = false;
            // dbg!(config::ARTICLE_DIR);
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
                let fout = format!(
                    "{}/{}.html",
                    config::ARTICLE_OUT_DIR,
                    name.to_string().strip_filetype()
                );

                if need_rebuild(&fin, &fout) {
                    ret = true;
                }
            }
            ret
        };

        let html = if rebuild {
            rebuild_html_template("blog", build_blog)
        } else {
            get_template("blog", build_blog)
        };
        
        Response::new()
            .text(header::generate_header(&html))
            .content(Content::HTML)
    });
}
