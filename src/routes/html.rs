use crate::config;
use afire::Request;

use anyhow::*;

// use anyhow::Result;

pub fn get_req(req: Request) -> Result<Request> {
    let mut out = req.clone();
    out.path = format!("{}{}", *config::TEMPLATE_DIR, req.path);
    Ok(req)
}
