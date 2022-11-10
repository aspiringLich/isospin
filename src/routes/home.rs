use afire::prelude::*;
use afire::{Content, Response};

use crate::{config, file::*};
#[path = "header.rs"]
mod header;

use super::html::{get_template, rebuild_html_template};
use super::md;

fn build_home(template: String) -> String {
    let mut projects = "".to_string();

    for name in config::PROJECTS {
        projects += &format!(
            "<div class=\"wrapper\"><img class=\"icon\"src=\"assets/{}.png\"><div class=\"desc\">{}</div></div>",
            name,
            md::get_file(format!("/{}.md", name)).unwrap(),
        );
    }

    template.replacen("{{CONTENT}}", &projects, 1)
}

/// route for `/home`, goes to the home screen
pub fn attach(server: &mut Server) {
    // home screen
    server.route(Method::GET, "/home", |_req| {
        // do we need a rebuild anyway because of the markdown files?
        let rebuild = config::PROJECTS
            .iter()
            .any(|name| need_rebuild(&format!("/{}.md", name), &format!("/{}.html", name)));

        let template = header::generate_header();
        let content = if rebuild {
            rebuild_html_template("/home.html", build_home)
        } else {
            get_template("/home.html", build_home)
        };

        Response::new()
            .text(template.replacen("{{CONTENT}}", &content, 1))
            .content(Content::HTML)
    });
}
