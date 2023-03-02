use std::fs;

use rand::prelude::*;

use crate::{ config, routes::html::read_template, template::TemplateBuilder };

const GRID: i32 = 8;
const POST_ITS: i32 = 8;

pub fn generate_header<'a>(
    content: &str
) -> String {
    let template = read_template("header");
    let template = TemplateBuilder::from_template(&template).unwrap();

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

        for i in 0..(POST_ITS as usize) / 2 {
            let rot = rand::random::<f32>() * 45.0 - 22.5;
            let x = (img_x[i] as f32) / (GRID as f32);
            let y = (img_y[i] as f32) / (GRID as f32);
            let hue = rng.gen_range(0.0..360.0);
            let post_it_img = img_order.next().unwrap();

            out += &TemplateBuilder::from_template(&read_template("post_it"))
                .unwrap()
                .replace("ROT", rot)
                .replace("POS", pos)
                .replace("X", x)
                .replace("TOP", y)
                .replace("IMG", post_it_img)
                .replace("HUE", hue)
                // .replace("DELAY", rand::random::<f32>())
                .build();
        }
        out
    };

    let preconnect = (1..=POST_ITS)
        .into_iter()
        .map(|n|
            format!(r#"<link rel="preconnect" href="assets/post-it-notes/{}.svg" as="image">"#, n)
        )
        .collect::<String>();

    template
        .replace("POST-IT-L", generate_html("left"))
        .replace("POST-IT-R", generate_html("right"))
        .replace("PRECONNECT", preconnect)
        .replace("CONTENT", content)
        .build()
}