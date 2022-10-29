use afire::prelude::*;

use super::html;
use super::md;

pub struct root;

impl Middleware for root {
    fn pre(&self, req: &error::Result<Request>) -> MiddleRequest {
        // filter out all the requests were not interested in
        let mut req = match req {
            Ok(r) => r,
            Err(_) => return MiddleRequest::Continue,
        }
        .clone();
        if req.method != Method::GET {
            return MiddleRequest::Continue;
        }

        // just the root path, "redirect" to home
        if req.path == "/" {
            req.path = "/home".to_string();
            return MiddleRequest::Add(req);
        }

        let file_type = req.path.split(".").last().unwrap_or("");
        // dbg!(file_type);
        let ret = match file_type {
            "md" => md::get_req(req),
            "html" => html::get_req(req),
            _ => return MiddleRequest::Continue,
        };

        if let Ok(req) = ret {
            return MiddleRequest::Add(req);
        }

        MiddleRequest::Continue
    }
}