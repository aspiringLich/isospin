use std::fs;

use crate::{config, file::*, info};
use afire::Request;

use anyhow::Result;
use crossterm::style::PrintStyledContent;

// use anyhow::Result;

pub fn get_req(req: Request) -> Result<Request> {
    // let mut out = req.clone();
    // out.path = format!("{}{}", &*config::TEMPLATE_DIR, req.path);
    Ok(req)
}

fn template_needs_rebuild(path: &str) -> bool {
    need_rebuild(
        &format!("{}{}", config::TEMPLATE_DIR, path),
        &format!("{}{}", config::BAKED_TEMPLATE_DIR, path),
    )
}

/// gets the built template
/// will check if its necessary before running the build_fn
/// handles writing out to file
pub fn get_template<F>(path: &str, build_fn: F) -> String
where
    F: Fn(String) -> String,
{
    if template_needs_rebuild(&path) {
        rebuild_html_template(path, build_fn)
    } else {
        // dbg!("bababooey");
        fs::read_to_string(&format!("{}{}", config::BAKED_TEMPLATE_DIR, path))
            .expect("html file should exist")
    }
}

/// rebuilds a template given a path like "/blog.html"
/// will NOT check if its necessary before running the build_fn
/// handles writing out to file
pub fn rebuild_html_template<F>(path: &str, build_fn: F) -> String
where
    F: Fn(String) -> String,
{
    info!(
        PrintStyledContent("Rebuilding html file: ".blue()),
        PrintStyledContent(format!("{}\n", path).yellow()),
    );
    let out = build_fn(
        fs::read_to_string(&format!("{}{}", config::TEMPLATE_DIR, path))
            .expect("html file and ./web/template/baked/ should exist"),
    );

    fs::write(&format!("{}{}", config::BAKED_TEMPLATE_DIR, path), &out).expect("write successful");
    out
}
