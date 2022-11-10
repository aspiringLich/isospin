use afire::prelude::*;
use comrak::{markdown_to_html, ComrakOptions, ComrakRenderOptions};
use std::{default::default, fs};

use crate::{config, file::*};

use anyhow::Result;

pub fn get_file(path: String) -> Result<String> {
    Ok(fs::read_to_string(reparse_and_get_html(path))?)
}

/// returns a new request for the coorosponding html file
pub fn get_req(req: Request) -> Result<Request> {
    let mut out = req.clone();

    out.path = reparse_and_get_html(req.path)
        .split("static")
        .last()
        .unwrap()
        .to_string();
    return Ok(out);
}

/// returns the path of the new html, reparsing if necessary
/// will not unecessarily reparse markdown files
/// will reparse if:
///  - theres no html file
///  - if the md file has been modified more recently
fn reparse_and_get_html(path: String) -> String {
    // options
    let options: ComrakOptions = ComrakOptions {
        render: ComrakRenderOptions {
            unsafe_: true,
            ..default()
        },
        ..default()
    };

    // get the full paths
    // dbg!(&path_html);
    let path_html = path.strip_filetype() + ".html";
    let path_html = format!("{}{}", &*config::PROJECTS_DIR, path_html);

    let path_md = format!("{}{}", &*config::MARKDOWN_IN_DIR, path);

    if need_rebuild(&path_md, &path_html) {
        // ok so read and parse the md file
        let string = fs::read_to_string(&path_md).expect("md file should be there");
        let html = format!(
            "<div class=\"markdown-body\">{}</div>",
            markdown_to_html(&string, &options)
        );

        // write it out!
        // dbg!(&path_html);
        fs::write(&path_html, &html).expect("should be able to write the parsed md successfully");
    }

    path_html
}
