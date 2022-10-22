use std::fs;

use afire::{extension::ServeStatic, prelude::*};
use image::*;
use imageproc::map;

fn process_imgs() {
    // process post-it images
    let out_path = "./web/template/assets/post-it-imgs/".to_owned();
    let in_path = "./src/template/assets/pictures/".to_owned();

    let img: RgbImage = ImageBuffer::new(1404, 1872);

    const IMGS: usize = 3;

    const GIRD_SIZE: u32 = 59;
    const TOP_LEFT: (u32, u32) = (53 + GIRD_SIZE / 2, 167 + GIRD_SIZE / 2);
    const BLOCK_SIZE: u32 = 9;
    let expand = 10;

    for i in 1..=IMGS {
        let output_image = |i: usize, startx, starty, n| {
            let path = in_path.clone() + &i.to_string() + &".png";
            let mut img = image::open(path).unwrap();
            img = img.crop(
                TOP_LEFT.0 + startx * GIRD_SIZE - expand,
                TOP_LEFT.1 + starty * GIRD_SIZE - expand,
                BLOCK_SIZE * GIRD_SIZE + expand * 2,
                BLOCK_SIZE * GIRD_SIZE + expand * 2,
            );
            // swap colors: black stays, gray goes to different gray, white goes
            let out = map::map_colors(&img, |x| {
                if x.0 == [255, 255, 255, 255] {
                    image::Rgba([0, 0, 0, 0])
                } else if x.0 == [157, 157, 157, 255] {
                    image::Rgba([0, 0, 0, 127])
                } else if x.0 == [201, 201, 201, 255] {
                    image::Rgba([0, 0, 0, 63])
                } else {
                    x
                }
            })
            .save(format!("{}{}.png", out_path, n));
            out
        };
        // dbg!("aiosjd");
        let mut a;
        a = (i - 1) * 4 + 1;
        assert!(output_image(i, 0, 0, a).is_ok());
        eprint!("\r({} / {})", a, IMGS * 4);
        a += 1;
        assert!(output_image(i, 10, 0, a).is_ok());
        eprint!("\r({} / {})", a, IMGS * 4);
        a += 1;
        assert!(output_image(i, 0, 10, a).is_ok());
        eprint!("\r({} / {})", a, IMGS * 4);
        a += 1;
        assert!(output_image(i, 10, 10, a).is_ok());
        eprint!("\r({} / {})", a, IMGS * 4);
    }
}

fn main() {
    let args = std::env::args().skip(1).collect::<Vec<_>>();

    if args.contains(&"setup".to_string()) {
        println!("Processing images!");
        process_imgs();
    }

    let mut server: Server = Server::<()>::new("localhost", 8080);

    // server fles
    ServeStatic::new("./web/static")
        .middleware(|req, res, suc| {
            // Print path sevred
            println!("Served: {}", req.path);
            Some((res.header("X-Static-Serve", "true"), suc))
        })
        .not_found(|_req, _dis| {
            Response::new()
                .status(404)
                .text("Pretend theres a good 404 screen here thanks")
        })
        .mime_type("key", "value")
        .path("/")
        .attach(&mut server);

    // home screen
    server.route(Method::GET, "/", |_req| {
        match fs::read("./web/static/header.html") {
            // If its found send it as response
            // This used `new_raw` to send the file as raw bytes not a string
            // This may not be useful for html files but if you want to to serve an image file this will be useful
            Ok(content) => Response::new()
                .status(200)
                .bytes(content)
                .header("Content-Type", "text/html"),

            // If not send a 404 error
            Err(_) => Response::new()
                .status(404)
                .text("Not Found :/")
                .header("Content-Type", "text/html"),
        }
    });

    // server start
    server.start().unwrap();
}
