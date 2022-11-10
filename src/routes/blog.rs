use afire::prelude::*;
use afire::{Content, Response};

use std::default::default;
use std::io::BufRead;
use std::{fs::File, io::BufReader};

use crate::{config, file::*};
#[path = "header.rs"]
mod header;

use super::html::{get_template, rebuild_html_template};
use super::md;

#[derive(Default, Debug)]
struct Preview {
    title: Option<String>,
    description: Option<String>,
}

impl Preview {
    fn new(path: &str) -> Self {
        let file = File::open(path).expect("can open {path}");
        let mut reader = BufReader::new(file);

        let mut lines = reader.lines();
        // assert that the md file starts with "<!-- isospin.dev header" or something
        // this is the header of the md file
        assert_eq!(
            lines
                .next()
                .expect("at least one line")
                .unwrap()
                .chars()
                .filter(|&x| !x.is_whitespace())
                .collect::<String>(),
            "<!--isospin.devheader",
            "asserting that the md file we're trying to read ({}) has a valid header start",
            path
        );

        let mut out: Preview = default();
        // get lines until a line contains the end of a comment
        lines
            .filter_map(|x| x.ok())
            .take_while(|x| !x.contains("-->"))
            // now for each of these lines, process them and do the coorosponding thing
            .for_each(|line| {
                let (field, value) = line
                    .split_once(":")
                    .expect("header config lines should have a colon");

                // remove leading whitespace
                let value: String = value.chars().skip_while(|&ch| ch.is_whitespace()).collect();
                // set the corresponding field in out
                *match field {
                    "title" => &mut out.title,
                    "description" => &mut out.description,
                    _ => panic!("expected valid header fields"),
                } = Some(value);
            });

        out
    }
}

fn blog_item(path: String) -> String {
    // the formatter *really* fucks this up
    // :(
    // looks so ugly bro
    dbg!(Preview::new(&path));
    format!(
        "
<div style=\"position: relative\">{}</div>
",
        path
    )
}

fn build_blog(template: String) -> String {
    let mut blog = "".to_string();

    // get all the file paths
    std::fs::read_dir(config::ARTICLE_DIR)
        .expect("article_dir should exist")
        .map(|x| {
            let item = x.ok()?;
            let name = item.file_name();
            Some(format!(
                "{}/{}",
                config::ARTICLE_DIR,
                name.as_os_str().to_str()?
            ))
        })
        // filter out all the nones
        .filter(|x| x.is_some())
        .map(|x| x.unwrap())
        // and add all the blog thingies to blog
        .for_each(|x| blog += &blog_item(x));

    template.replacen("{{CONTENT}}", &blog, 1)
}

/// route for `/blog`, goes to my archive of schizophrenic rambling
pub fn attach(server: &mut Server) {
    // home screen
    server.route(Method::GET, "/blog", |_req| {
        // do we need a rebuild anyway because of the markdown files?
        let rebuild = config::PROJECTS
            .iter()
            .any(|name| need_rebuild(&format!("/{}.md", name), &format!("/{}.html", name)));

        let template = header::generate_header();
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
