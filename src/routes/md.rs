use afire::prelude::*;
use comrak::{markdown_to_html, ComrakOptions, ComrakRenderOptions};
use std::{cmp::Ordering, fs};

use crate::config;

use anyhow::{Context, Result};

pub fn get_file(path: String) -> Result<String> {
    Ok(fs::read_to_string(reparse_and_get_html(path)?)?)
}

/// returns a new request for the coorosponding html file
pub fn get_req(req: Request) -> Result<Request> {
    let mut out = req.clone();

    out.path = reparse_and_get_html(req.path)?
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
fn reparse_and_get_html(path: String) -> Result<String> {
    // options
    let options: ComrakOptions = ComrakOptions {
        render: ComrakRenderOptions {
            unsafe_: true,
            ..Default::default()
        },
        ..Default::default()
    };

    // get the full paths
    // dbg!(&path_html);
    let mut path_html = path.clone().split(".").next().unwrap().to_owned() + ".html";
    path_html = format!("{}{}", *config::MARKDOWN_OUT_DIR, path_html);
    let path_md = format!("{}{}", *config::MARKDOWN_IN_DIR, path);

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
        if let (Some(Ok(mod_html)), Some(Ok(mod_md))) = (&last_modified_html, &last_modified_md) {
            // if the md has been modified more recently than the html we need to rebuild anyway
            // dbg!(&mod_html, &mod_md);
            // dbg!(mod_md.cmp(&mod_html));
            mod_md.cmp(&mod_html) == Ordering::Greater
        } else {
            last_modified_html.is_none()
        };

    if rebuild {
        // ok so read and parse the md file
        let string = fs::read_to_string(&path_md).context("couldnt find md file")?;
        let html = format!(
            "<div class=\"markdown-body\">{}</div>",
            markdown_to_html(&string, &options)
        );

        // write it out!
        fs::write(&path_html, &html).context("failed to write out parsed md")?;
    }

    Ok(path_html)
}
