use crate::Server;
use afire::prelude::*;

mod article;
mod blog;
mod home;
mod html;
mod md;
mod root;
mod header;

pub fn attach(server: &mut Server) {
    home::attach(server);
    root::Root.attach(server);
    root::attach(server);
    blog::attach(server);
    article::attach(server);
}

/* TEMPLATE: replace _page with whatever

/// build _page off of /_page.html
fn build__page(template: String) -> String {
    let mut header = header::generate_header();
    let mut content = "".to_string();
    content = template;
    header.replacen("{{CONTENT}}", &content, 1)
}

pub fn attach(server: &mut Server) {
    server.route(Method::GET, "/_page", |_req| {
        let rebuild = false;

        let html = if rebuild {
            rebuild_html_template("/_page.html", build__page)
        } else {
            get_template("/_page.html", build__page)
        };

        Response::new().text(html).content(Content::HTML)
    });
}

*/
