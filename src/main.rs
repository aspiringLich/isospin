use afire::{extension::ServeStatic, prelude::*};

mod config;
mod routes;
mod setup;
#[macro_use]
mod sh;

fn main() -> Result<(), &'static str> {
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
            eprintln!("failed to serve file: {}", req.path);
            let cls = || -> Result<Response, &str> {
                let res = Response::new()
                    .status(404)
                    .text("Pretend theres a good 404 screen here thanks");
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
