use lazy_static::lazy_static;
use std::{collections::HashMap, fs, sync::Mutex};

use crate::{config, Server};
use afire::{Content, Response};
use comrak::{markdown_to_html, ComrakOptions, ComrakParseOptions, ComrakRenderOptions};

mod home;

pub fn attach(server: &mut Server) {
    home::attach(server);
}

// returns the coorosponding markdown file from MARKDOWN_DIR as html
// stores markdown files its seen before in a hasmap so it doesnt have to reconvert them into html
pub fn get_markdown(path: &String) -> Response {
    let options: ComrakOptions = ComrakOptions {
        render: ComrakRenderOptions {
            unsafe_: true,
            ..Default::default()
        },
        ..Default::default()
    };

    let path_html = path.clone().split(".").next().unwrap().to_owned() + ".html";

    if let Ok(string) = fs::read_to_string(format!("{}{}", *config::MARKDOWN_OUT_DIR, path_html)) {
        return Response::new().text(string).content(Content::HTML);
    }

    let f = fs::read_to_string(format!("{}{}", *config::MARKDOWN_IN_DIR, path));
    if let Ok(string) = f {
        let html = markdown_to_html(&string, &options);
        match fs::write(format!("{}{}", *config::MARKDOWN_OUT_DIR, path_html), &html) {
            Ok(_) => {}
            Err(err) => return config::ERROR(&err),
        }
        Response::new().text(html).content(Content::HTML)
    } else {
        config::ERROR(&f.err().unwrap())
    }
}
