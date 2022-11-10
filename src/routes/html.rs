use std::fs;

use crate::{config, file::*};
use afire::Request;

use anyhow::*;

// use anyhow::Result;

pub fn get_req(req: Request) -> Result<Request> {
    let mut out = req.clone();
    out.path = format!("{}{}", &*config::TEMPLATE_DIR, req.path);
    Ok(req)
}

pub fn template_needs_rebuild(path: &str) -> bool {
    need_rebuild(
        &format!("{}{}", config::TEMPLATE_DIR, path),
        &format!("{}{}", config::BAKED_TEMPLATE_DIR, path),
    )
}

pub fn get_template(path: &str, build_fn: fn(String) -> String) -> String {
    if template_needs_rebuild(&path) {
        rebuild_html_template(path, build_fn)
    } else {
        // dbg!("bababooey");
        fs::read_to_string(&format!("{}{}", config::BAKED_TEMPLATE_DIR, path))
            .expect("html file should exist")
    }
}

pub fn rebuild_html_template(path: &str, build_fn: fn(String) -> String) -> String {
    let out = build_fn(
        fs::read_to_string(&format!("{}{}", config::TEMPLATE_DIR, path))
            .expect("html file should exist"),
    );

    fs::write(&format!("{}{}", config::BAKED_TEMPLATE_DIR, path), &out).expect("write successful");
    out
}
