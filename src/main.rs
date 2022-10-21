use image::*;
use imageproc::map;
use std::fmt;
use std::fs::File;
use std::time::{Duration, Instant};

fn main() {
    // process post-it images
    let out_path = "./web/post-it-imgs/".to_owned();
    let in_path = "./src/in/".to_owned();

    let img: RgbImage = ImageBuffer::new(1404, 1872);

    const imgs: usize = 3;

    const grid_size: u32 = 59;
    const top_left: (u32, u32) = (53 + grid_size / 2, 167 + grid_size / 2);
    const block_size: u32 = 9;
    let expand = 10;

    for i in 1..=imgs {
        println!("openning {}.png...", i);

        let output_image = |i: usize, startx, starty, n| {
            let path = in_path.clone() + &i.to_string() + &".png";
            dbg!(&path);
            let mut img = image::open(path).unwrap();
            println!("processing {}.png...", i);
            img = img.crop(
                top_left.0 + startx * grid_size - expand,
                top_left.1 + starty * grid_size - expand,
                block_size * grid_size + expand * 2,
                block_size * grid_size + expand * 2,
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
            println!("image processing succsessful!");
            out
        };

        assert!(output_image(i, 0, 0, (i - 1) * 4 + 1).is_ok());
        assert!(output_image(i, 10, 0, (i - 1) * 4 + 2).is_ok());
        assert!(output_image(i, 0, 10, (i - 1) * 4 + 3).is_ok());
        assert!(output_image(i, 10, 10, (i - 1) * 4 + 4).is_ok());
    }
}
