use afire::{internal::path, prelude::*};
use comrak::{markdown_to_html, ComrakExtensionOptions, ComrakOptions, ComrakRenderOptions};
use lazy_static::lazy_static;
use std::{default::default, fs};

use crate::{config, file::*};

use anyhow::Result;

// pub fn get_file(path_orig: &str, path_parsed: &str) -> String {
//     write_md_and_get_string(path_orig, path_parsed)
// }

// /// returns a new request for the coorosponding md file
// pub fn get_req(req: Request) -> Result<Request> {
//     let mut out = req.clone();

//     out.path = parse_md_to_string(req.path)
//         .split("static")
//         .last()
//         .unwrap()
//         .to_string();
//     return Ok(out);
// }

lazy_static! {
    // options
    pub static ref OPTIONS: ComrakOptions = ComrakOptions {
        extension: ComrakExtensionOptions {
            strikethrough: true,
            tagfilter: true,
            table: true,
            autolink: true,
            tasklist: true,
            superscript: true,
            footnotes: true,
            description_lists: true,
            front_matter_delimiter: Some("---".to_string()),
            ..default()
        },
        render: ComrakRenderOptions {
            unsafe_: true,
            ..default()
        },
        ..default()
    };

}

/// returns a string of the parsed markdown, reparsing if necessary
/// will not unecessarily reparse markdown files
///
/// will write to path_parsed
pub fn write_md_and_get_string(path_orig: &str, path_parsed: &str) -> String {
    if need_rebuild(path_orig, path_parsed) {
        // ok so read and parse the md file
        let string = fs::read_to_string(path_orig).expect("md file should be there");
        let html = format!(
            "<div class=\"markdown-body\">{}</div>",
            markdown_to_html(&string, &OPTIONS)
        );
        // write it out!
        fs::write(path_parsed, &html).expect("should be able to write the parsed md successfully");
        return html;
    }

    fs::read_to_string(path_parsed).expect("read successful")
}

// /// parse the file from path_orig, and stick it in path_parsed if necessary
// /// return whether any reparsing / building / whatever was necessary
// ///
// /// will write to path_parsed
// pub fn write_md(path_orig: &str, path_parsed: &str) -> bool {
//     let ret = need_rebuild(path_orig, path_parsed);
//     write_md_and_get_string(path_orig, path_parsed);
//     ret
// }

/// dont do anything fancy, just get me the parsed md
pub fn parse_md(path: &str) -> String {
    let string = fs::read_to_string(path).expect("md file should be there");
    format!(
        "<div class=\"markdown-body\">{}</div>",
        markdown_to_html(&string, &OPTIONS)
    )
}
