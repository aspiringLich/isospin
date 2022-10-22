use std::fs;

use afire::prelude::*;

#[path = "../config.rs"]
mod config;
#[path = "header.rs"]
mod header;

pub fn attach(server: &mut Server) {
    // home screen
    server.route(Method::GET, "/", |_req| {
        let template = header::generate_header().replacen("{{CONTENT}}", "", 1);

        Response::new().text(template).content(Content::HTML)
    });
}
