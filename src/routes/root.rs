use std::default::default;

use afire::prelude::*;

use super::html;
use super::md;

pub struct Root;

impl Middleware for Root {
    fn pre(&self, req: &error::Result<Request>) -> MiddleRequest {
        // filter out all the requests were not interested in
        let req = match req {
            Ok(r) => r,
            Err(_) => return MiddleRequest::Continue,
        }
        .clone();
        if req.method != Method::GET {
            return MiddleRequest::Continue;
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

pub fn attach(server: &mut Server) {
    server.route(Method::GET, "/", |_req| Response {
        status: 301,
        headers: vec![Header::from_string("Location: /home").unwrap()],
        ..default()
    });
}
