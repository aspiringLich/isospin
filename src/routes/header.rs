use std::fs;

use rand::prelude::*;

use crate::{config, routes::html::read_template};

const GRID: i32 = 8;
const POST_ITS: i32 = 8;

pub fn generate_header() -> String {
    let template = read_template("/header.html");

    let mut rng = thread_rng();

    // img order: shuffle the list of images
    let paths = fs::read_dir(&*config::POST_IT_IMGS_DIR);
    let mut img_order: Vec<u32> = (1..=paths.unwrap().collect::<Vec<_>>().len() as u32).collect();
    img_order.shuffle(&mut rng);
    let mut img_order = img_order.iter();
    
    let mut generate_html = |pos| {
        let mut out: String = Default::default();
        
        let mut img_x: Vec<i32> = (1..GRID).collect();
        img_x.shuffle(&mut rng);
        let mut img_y: Vec<i32> = (1..GRID).collect();
        img_y.shuffle(&mut rng);

        for i in 0..POST_ITS as usize / 2 {
            let rot = rand::random::<f32>() * 45. - 22.5;
            let x = img_x[i] as f32 / GRID as f32;
            let y = img_y[i] as f32 / GRID as f32;
            let hue = rng.gen_range(0.0..360.0);
            let post_it_img = img_order.next().unwrap();
            
            out += &read_template("/post_it.html")
                .replace("{{ROT}}", &rot.to_string())
                .replace("{{POS}}", pos)
                .replace("{{X}}", &x.to_string())
                .replace("{{TOP}}", &y.to_string())
                .replace("{{IMG}}", &post_it_img.to_string())
                .replace("{{HUE}}", &hue.to_string());
        }
        out
    };

    template
        .replacen("{{POST-IT-L}}", &generate_html("left"), 1)
        .replacen("{{POST-IT-R}}", &generate_html("right"), 1)
}
