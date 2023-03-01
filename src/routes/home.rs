use afire::prelude::*;
use afire::{ Content, Response };

use crate::config;

use super::header;
use super::html::{ get_template, rebuild_html_template, read_template };
use super::md::{ self, write_md_get_rebuild };

fn build_home(template: String) -> String {
    let mut projects = "".to_string();

    let project_template = read_template("project");

    for name in config::PROJECTS {
        let md = md::write_md_and_get_string(
            &format!("{}/{}.md", config::PROJ_DESC_DIR, name),
            &format!("{}/{}.md", config::PROJECTS_DIR, name)
        );

        let new = project_template.clone().replace("{{NAME}}", name).replace("{{CONTENT}}", &md);
        projects += &new;
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
            .any(|name| {
                write_md_get_rebuild(
                    &format!("{}/{}.md", config::PROJ_DESC_DIR, name),
                    &format!("{}/{}.html", config::PROJECTS_DIR, name)
                )
            });

        let html = if rebuild {
            rebuild_html_template("home", build_home)
        } else {
            get_template("home", build_home)
        };
        let template = header::generate_header(&html);
        
        Response::new().text(template).content(Content::HTML)
    });
}