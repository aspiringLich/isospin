use std::fs;

use afire::prelude::*;
use crossterm::style::Print;

use super::{
    blog::FrontMatter,
    html::{get_template, rebuild_html_template},
    md::parse_md,
};
use crate::{config, file::PathMethods, info};
use crate::{file::need_rebuild, routes::md::write_md_and_get_string};

/// build article off of /article.html
///
fn build_article(article: &str) -> String {
    let template_file = &format!("{}/article.html", config::TEMPLATE_DIR);
    let article_in = &format!("{}/{}.md", config::ARTICLE_DIR, article);
    let article_out = &format!("{}/{}.html", config::ARTICLE_OUT_DIR, article);

    if need_rebuild(template_file, article_out) || need_rebuild(article_in, article_out) {
        info!(Print(format!("Rebuilding article: {}", article)));

        let mut template = fs::read_to_string(template_file)
            .expect("template/article.html or whatever should exist");

        let header = FrontMatter::new(article_in);
        template = template.replacen("{{HEAD}}", &header.head, 1);
        let html = template.replacen("{{CONTENT}}", &parse_md(article_in), 1);
        fs::write(article_out, &html).expect("write successful");
        html
    } else {
        fs::read_to_string(article_out).expect("valid since need_rebuild was false")
    }
}

pub fn attach(server: &mut Server) {
    server.route(Method::GET, "/article/*", |req| {
        let article = &req.path.split("/").nth(2).expect("path has at least 2 /");
        let html = build_article(article);

        Response::new().text(html).content(Content::HTML)
    });
}
