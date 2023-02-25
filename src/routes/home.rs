use afire::prelude::*;
use afire::{Content, Response};

use crate::config;
#[path = "header.rs"]
mod header;

use super::html::{get_template, rebuild_html_template};
use super::md::{self, write_md_get_rebuild};

fn title_bar(name: &str) -> String {
    format!("
<div id=\"title-bar\">
    <i>
        <span style=\"color:var(--gb-blue)\">#desc</span><span style=\"color:var(--gb-green)\"> - </span><span style=\"color:var(--gb-yellow)\">web</span><span
        style=\"color:var(--gb-green)\">/</span><span style=\"color:var(--gb-yellow)\">static</span><span style=\"color:var(--gb-green)\">/</span><span
        style=\"color:var(--gb-yellow)\">projects</span><span style=\"color:var(--gb-green)\">/</span><span
        style=\"color:var(--gb-yellow)\">{name}</span><span style=\"color:var(--gb-red)\">.md</span>
    </i>
</div>
")
}

fn build_home(template: String) -> String {
    let mut projects = "".to_string();

    for name in config::PROJECTS {
        projects += &format!(
            "<div class=\"proj-wrapper\"><img class=\"icon\"src=\"projects/{}.png\"><div class=\"desc\">{}{}</div></div>",
            name,
            title_bar(name),
            md::write_md_and_get_string(&format!("{}/{}.md", config::PROJ_DESC_DIR, name), &format!("{}/{}.md", config::PROJECTS_DIR, name)),
        );
    }

    template.replacen("{{CONTENT}}", &projects, 1)
}

/// route for `/home`, goes to the home screen
pub fn attach(server: &mut Server) {
    // home screen
    server.route(Method::GET, "/home", |_req| {
        // do we need a rebuild anyway because of the markdown files?
        let rebuild = config::PROJECTS.iter().any(|name| {
            write_md_get_rebuild(
                &format!("{}/{}.md", config::PROJ_DESC_DIR, name),
                &format!("{}/{}.html", config::PROJECTS_DIR, name),
            )
        });

        let html = if rebuild {
            rebuild_html_template("/home.html", build_home)
        } else {
            get_template("/home.html", build_home)
        };
        let template = header::generate_header();

        Response::new()
            .text(template.replacen("{{CONTENT}}", &html, 1))
            .content(Content::HTML)
    });
}
