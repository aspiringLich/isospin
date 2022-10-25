use std::fs;

use afire::prelude::*;

use rand::prelude::*;

#[path = "../config.rs"]
mod config;

pub fn generate_header() -> String {
    const post_its: u32 = 8;

    let mut rng = thread_rng();

    // img order: shuffle the list of images
    let paths = fs::read_dir(&*config::POST_IT_IMGS_DIR);
    let mut img_order: Vec<u32> = (1..=paths.unwrap().collect::<Vec<_>>().len() as u32).collect();
    img_order.shuffle(&mut rng);
    let mut img_order = img_order.iter();

    let mut generate_html = || {
        let mut out: String = Default::default();

        let mut img_x: Vec<u32> = (1..=(post_its / 2)).collect();
        img_x.shuffle(&mut rng);
        let mut img_y: Vec<u32> = (1..=(post_its / 2)).collect();
        img_y.shuffle(&mut rng);

        for i in 0..post_its as usize / 2 {
            let rot = rand::random::<f32>() * 45. - 22.5;
            let x = img_x[i] as i32 * 5 - 8;
            let y = img_y[i] as i32 * 3 - 5;
            let post_it_col = ["blue", "green", "purple", "red", "yellow"][random::<usize>() % 5];
            let post_it_img = img_order.next().unwrap();

            out += &format!(
                "<div id=\"note\" style=\"rotate: {rot}deg; left: {x}vw; top: calc({y}vw)\">\
                 <object type=\"image/svg+xml\" data=\"assets/post-its/{post_it_col}.svg\"></object>\
                 <img src=\"assets/post-it-imgs/{post_it_img}.png\" class=\"center\"></img></div>"
            );
        }
        out
    };

    fs::read_to_string(config::TEMPLATE_DIR.to_string() + "/header.html")
        .unwrap()
        .replacen("{{POST-IT-L}}", &generate_html(), 1)
        .replacen("{{POST-IT-R}}", &generate_html(), 1)
}
