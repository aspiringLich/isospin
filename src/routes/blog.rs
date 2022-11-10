use afire::prelude::*;
use afire::{Content, Response};

use crate::{config, file::*};
#[path = "header.rs"]
mod header;

use super::html::{get_template, rebuild_html_template};
use super::md;

fn build_blog(template: String) -> String {
    let mut blog = "";

    template
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
