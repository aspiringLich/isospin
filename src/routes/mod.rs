use lazy_static::lazy_static;
use std::{collections::HashMap, fs, sync::Mutex};

use crate::{config, Server};
use afire::{Content, Response};

mod home;

pub fn attach(server: &mut Server) {
    home::attach(server);
}

lazy_static! {
    static ref markdown_table: Mutex<HashMap<String, String>> = Mutex::new(HashMap::new());
}
// returns the coorosponding markdown file from MARKDOWN_DIR as html
// stores markdown files its seen before in a hasmap so it doesnt have to reconvert them into html
pub fn get_markdown(path: &String) -> Response {
    let mut table = markdown_table.lock().unwrap();

    if let Some(string) = table.get(path) {
        return Response::new().text(string).content(Content::HTML);
    }

    if let Ok(string) = markdown::file_to_html(std::path::Path::new(
        &(config::MARKDOWN_DIR.to_string() + path),
    )) {
        table.insert(path.clone(), string.clone());
        Response::new().text(string).content(Content::HTML)
    } else {
        config::FILE_NOT_FOUND.clone()
    }
}
