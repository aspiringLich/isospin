#![feature(default_free_fn)]

use afire::{extension::ServeStatic, prelude::*};
use anyhow::Result;
use chrono::Utc;
use crossterm::{
    execute,
    style::{PrintStyledContent, Stylize},
};
use std::io::stdout;

mod config;
mod file;
mod routes;
mod setup;
#[macro_use]
mod sh;

fn main() -> Result<()> {
    // let args = std::env::args().skip(1).collect::<Vec<_>>();

    // do this in another thing
    // if args.contains(&"setup".to_string()) {
    //     println!("Processing images!");
    //     setup::process_imgs();
    // }

    let mut server: Server = Server::<()>::new("localhost", 8080);

    // serve static fles
    ServeStatic::new("./web/static")
        .middleware(|_req, res, suc| {
            // println!("{} made a request", req.address);
            Some((res.header("X-Static-Serve", "true"), suc))
        })
        .not_found(|req, _dis| -> Response {
            execute!(
                stdout(),
                PrintStyledContent(format!("[{}] ", Utc::now().time().format("%H:%M:%S")).green()),
                PrintStyledContent("failed to serve static to\t".blue()),
                PrintStyledContent(format!("{}\t", req.address).green()),
                PrintStyledContent(format!("{}\n", req.path).yellow()),
            )
            .unwrap();
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
    server.start_threaded(4).unwrap();
    Ok(())
}
