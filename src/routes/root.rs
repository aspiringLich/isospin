use afire::prelude::*;

pub struct Root;

impl Middleware for Root {
    fn pre(&self, req: &mut Request) -> MiddleResult {
        // filter out all the requests were not interested in
        if req.method != Method::GET {
            return MiddleResult::Continue;
        }

        let file_type = req.path.split(".").last().unwrap_or("");
        let _ret = match file_type {
            // "md" => md::get_req(req),
            // "html" => html::get_req(req),
            _ => return MiddleResult::Continue,
        };
    }
}

pub fn attach(server: &mut Server) {
    server.route(Method::GET, "/", |_req| {
        Response::new()
            .status(Status::MovedPermanently)
            .header(HeaderType::Location, "/home")
    });
}
