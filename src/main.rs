#![feature(default_free_fn)]
#![feature(iter_array_chunks)]

use afire::{extension::ServeStatic, internal::common::remove_address_port, prelude::*};
use anyhow::Result;
use crossterm::style::PrintStyledContent;

extern crate chrono;
extern crate sqlite;

mod config;
mod file;
mod routes;
mod sql;

#[macro_use]
mod sh;

pub fn get_ip(req: &Request) -> String {
    let mut ip = remove_address_port(&req.address);
    if ip == "127.0.0.1" {
        if let Some(i) = req.headers.iter().find(|x| x.name == "X-Forwarded-For") {
            ip = i.value.to_owned();
        }
    }
    ip
}

fn main() -> Result<()> {
    let mut server: Server = Server::<()>::new("localhost", 8080);

    // serve static fles
    ServeStatic::new("./web/static")
        .middleware(|_req, res, suc| {
            // println!("{} made a request", req.address);
            Some((res.header("X-Static-Serve", "true"), suc))
        })
        .not_found(|req, _dis| -> Response {
            warn!(
                PrintStyledContent("failed to serve static to ".blue()),
                PrintStyledContent(format!("{} ", get_ip(req)).green()),
                PrintStyledContent(format!("{}\n", req.path).yellow()),
            );
            let cls = || -> Result<Response> {
                let res = Response::new()
                    .status(404)
                    .text("Pretend theres a good 404 screen here thanks\n\nbut yeah you're not supposed to see this. go back maybe?");
                Ok(res)
            };
            match cls() {
                Ok(res) => res,
                Err(err) => sh::err_temp(err),
            }
        })
        .path("/")
        .attach(&mut server);

    routes::attach(&mut server);

    // server start
    server
        .start_threaded(std::thread::available_parallelism().unwrap().get())
        .unwrap();
    Ok(())
}
