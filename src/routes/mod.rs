use lazy_static::lazy_static;
use std::{cmp::Ordering, collections::HashMap, fs, sync::Mutex};

use crate::{config, Server};
use afire::{Content, Response};
use comrak::{markdown_to_html, ComrakOptions, ComrakParseOptions, ComrakRenderOptions};

mod home;

pub fn attach(server: &mut Server) {
    home::attach(server);
}

// returns the coorosponding markdown file from MARKDOWN_DIR as html
// first checks if its already parsed a markdown file by the same name
pub fn get_markdown(path: &String) -> Response {
    // options
    let options: ComrakOptions = ComrakOptions {
        render: ComrakRenderOptions {
            unsafe_: true,
            ..Default::default()
        },
        ..Default::default()
    };

    // get the full paths
    let mut path_html = path.clone().split(".").next().unwrap().to_owned() + ".html";
    path_html = format!("{}{}", *config::MARKDOWN_OUT_DIR, path_html);
    let path_md = format!("{}{}", *config::MARKDOWN_IN_DIR, path);

    // dbg!(&path_html, &path_md);

    // make sure that the md file isnt more recent, cuz then we need to rebuild
    let mut last_modified_html = None;
    if let Ok(metadata) = fs::metadata(&path_html) {
        last_modified_html = Some(metadata.modified())
    }
    let mut last_modified_md = None;
    if let Ok(metadata) = fs::metadata(&path_md) {
        last_modified_md = Some(metadata.modified())
    }

    // dbg!(&last_modified_html, &last_modified_md);
    let rebuild =
        if let (Some(Ok(mod_html)), Some(Ok(mod_md))) = (last_modified_html, last_modified_md) {
            // if the md has been modified more recently than the html we need to rebuild anyway
            // dbg!(&mod_html, &mod_md);
            // dbg!(mod_md.cmp(&mod_html));
            mod_md.cmp(&mod_html) == Ordering::Greater
        } else {
            false
        };

    if !rebuild {
        // if there is already a html file available then just read from that
        if let Ok(string) = fs::read_to_string(&path_html) {
            return Response::new().text(string).content(Content::HTML);
        }
    }

    // ok so read and parse the md file
    let f = fs::read_to_string(&path_md);
    if let Ok(string) = f {
        let html = markdown_to_html(&string, &options);
        // modified html: just add some stuff so it uses a style sheet and does some stuff
        let mhtml = format!(
            "<!DOCTYPE html><head><link rel=\"stylesheet\" href=\"text.css\"></head><body><div class=\"md\">{}</div></body>",
            html
        );
        // write it out!
        match fs::write(&path_html, &mhtml) {
            Ok(_) => {}
            Err(err) => return config::ERROR(&err),
        }
        Response::new().text(mhtml).content(Content::HTML)
    } else {
        config::ERROR(&f.err().unwrap())
    }
}
