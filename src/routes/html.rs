use std::fs;

use crate::{ config, file::*, info };
use afire::Request;

use anyhow::{ Result, Context };
use crossterm::style::{PrintStyledContent, Print};

// use anyhow::Result;

pub fn get_req(req: Request) -> Result<Request> {
    // let mut out = req.clone();
    // out.path = format!("{}{}", &*config::TEMPLATE_DIR, req.path);
    Ok(req)
}

fn template_needs_rebuild(path: &str) -> bool {
    need_rebuild(
        &format!("{}/{}.html", config::TEMPLATE_DIR, path),
        &format!("{}/{}.html", config::BAKED_TEMPLATE_DIR, path)
    )
}

/// gets the built template
/// will check if its necessary before running the build_fn
/// handles writing out to file
pub fn get_template<F>(path: &str, build_fn: F) -> String where F: Fn(String) -> String {
    if template_needs_rebuild(&path) {
        rebuild_html_template(path, build_fn)
    } else {
        // dbg!("bababooey");
        read_baked_template(path)
    }
}

/// gets the baked html file
pub fn read_baked_template(path: &str) -> String {
    fs::read_to_string(&format!("{}/{}.html", config::BAKED_TEMPLATE_DIR, path)).expect(
        "html file should exist"
    )
}

/// gets the html file before baking / preprocessing
pub fn read_template(path: &str) -> String {
    fs::read_to_string(&format!("{}/{}.html", config::TEMPLATE_DIR, path)).expect(
        "html file should exist"
    )
}

/// rebuilds a template given a path like "/blog.html"
/// will NOT check if its necessary before running the build_fn
/// handles writing out to file
pub fn rebuild_html_template<F>(path: &str, build_fn: F) -> String where F: Fn(String) -> String {
    info!(
        "Rebuilding html file: ".blue(),
        path.yellow()
    );
    let template_path = format!("{}/{}.html", config::TEMPLATE_DIR, path);
    let out = build_fn(
        fs::read_to_string(&template_path).expect(&format!("expected {} to exist", path))
    );

    fs::write(format!("{}/{}.html", config::BAKED_TEMPLATE_DIR, path), &out).expect(
        "write successful"
    );
    out
}