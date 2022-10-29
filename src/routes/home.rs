use std::fs;

use afire::prelude::*;
use afire::{Content, Response};

use lazy_static::lazy_static;

#[path = "../config.rs"]
mod config;
#[path = "header.rs"]
mod header;

use super::md;

lazy_static! {
    static ref PAGE: String = {
        let out = fs::read_to_string(config::TEMPLATE_DIR.to_string() + "/header.html").unwrap();
        let mut projects = "".to_string();

        for name in config::PROJECTS {
            projects += &format!(
                "<div class=\"wrapper\"><img class=\"icon\"src=\"assets/{}.png\"><div class=\"desc\">{}</div></div>",
                name,
                md::get_file(format!("/{}.md", name)).unwrap(),
            );
        }

        out.replacen("{{CONTENT}}", &projects, 1)
    };
}

/// route for `/home`, goes to the home screen
pub fn attach(server: &mut Server) {
    // home screen
    server.route(Method::GET, "/home", |req| {
        let template = header::generate_header(&*PAGE);

        Response::new().text(template).content(Content::HTML)
    });
}
