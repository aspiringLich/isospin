use image::{imageops::resize, *};
use imageproc::map;

#[path = "config.rs"]
mod config;

pub fn process_imgs() {
    let img: RgbImage = ImageBuffer::new(1404, 1872);

    const IMGS: usize = 4;

    const GIRD_SIZE: u32 = 59;
    const TOP_LEFT: (u32, u32) = (53 + GIRD_SIZE / 2, 167 + GIRD_SIZE / 2);
    const BLOCK_SIZE: u32 = 9;
    let expand = 10;

    for i in 1..=IMGS {
        let output_image = |i: usize, startx, starty, n| {
            let path = format!("{}{}.png", *config::POST_IT_IMGS_IN_DIR, i);
            // dbg!(&path);
            let mut img = image::open(path).unwrap();
            img = img.crop_imm(
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
            });
            let out = resize(&out, 256, 256, imageops::FilterType::Gaussian).save(format!(
                "{}{}.png",
                *config::POST_IT_IMGS_DIR,
                n
            ));
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
