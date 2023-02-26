#![feature(default_free_fn)]
#![feature(iter_array_chunks)]

use std::{fs, net::IpAddr, thread};

use afire::{extension::ServeStatic, prelude::*};
use anyhow::{Result, Context};
use crossterm::style::PrintStyledContent;

extern crate chrono;
extern crate rusqlite;

mod config;
mod file;
mod routes;
mod sql;

#[macro_use]
mod sh;

// https://github.com/Basicprogrammer10/connorcode/blob/8b0755c3578d289f1172729263da93fa743fb321/src/common.rs#L55
pub trait RealIp {
    fn real_ip(&self) -> IpAddr;
}

impl RealIp for Request {
    fn real_ip(&self) -> IpAddr {
        let mut ip = self.address.ip();

        // If Ip is Localhost and 'X-Forwarded-For' Header is present
        // Use that as Ip
        if ip.is_loopback() && self.headers.has("X-Forwarded-For") {
            ip = self
                .headers
                .get("X-Forwarded-For")
                .unwrap()
                .parse()
                .unwrap();
        }

        ip
    }
}

fn main() -> Result<()> {
    use crate::config::*;
    // these folders may not there
    let possibly_ungenned_dirs = [BAKED_TEMPLATE_DIR, ARTICLE_OUT_DIR];
    for dir in possibly_ungenned_dirs {
        fs::create_dir_all(dir)?;
    }
    
    // now clear em out
    for entry in fs::read_dir(BAKED_TEMPLATE_DIR).context("can access BAKED_TEMPLATE_DIR")? {
        fs::remove_file(entry?.path())?;
    }

    let mut server: Server = Server::<()>::new("localhost", 8080);

    // serve static fles
    ServeStatic::new("./web/static")
        .middleware(|_req, res, _suc| {
            res.headers.push(Header::new("X-Static-Serve", "true"));
        })
        .not_found(|req, _dis| -> Response {
            warn!(
                PrintStyledContent("failed to serve static to ".blue()),
                PrintStyledContent(format!("{} ", req.real_ip()).green()),
                PrintStyledContent(format!("{}", req.path).yellow()),
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
        .start_threaded(thread::available_parallelism().unwrap().get())
        .unwrap();
    Ok(())
}
