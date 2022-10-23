use afire::{extension::ServeStatic, prelude::*};
use std::fs;

mod config;
mod routes;
mod setup;

fn main() {
    let args = std::env::args().skip(1).collect::<Vec<_>>();

    if args.contains(&"setup".to_string()) {
        println!("Processing images!");
        setup::process_imgs();
    }

    let mut server: Server = Server::<()>::new("localhost", 8080);

    // serve static fles
    ServeStatic::new("./web/static")
        .middleware(|req, res, suc| {
            println!("{} made a request", req.address);
            Some((res.header("X-Static-Serve", "true"), suc))
        })
        .not_found(|_req, _dis| {
            let mut res = Response::new()
                .status(404)
                .text("Pretend theres a good 404 screen here thanks");

            let is_html = _req.path.split(".").last() == Some("html");
            let is_get = _req.method == Method::GET;
            if is_get {
                res = Response::new().status(404).text("file not found :(")
            }
            res
        })
        .path("/")
        .attach(&mut server);

    routes::attach(&mut server);

    // server start
    server.start().unwrap();
}
