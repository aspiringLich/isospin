/// route for `/blog`, goes to my archive of schizophrenic rambling
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
