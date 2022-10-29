use std::fmt::Display;

use afire::Response;
use lazy_static::lazy_static;

lazy_static! {
    // the directory that contains the html template files
    pub static ref TEMPLATE_DIR: String = "./web/template/".to_string();
    // the directory that contains the assets for the website
    pub static ref ASSET_DIR: String = "./web/static/assets/".to_string();

    // the directory that contains the post it svgs: basically the post it notes themselves
    pub static ref POST_ITS_DIR: String = "./web/static/assets/post-its/".to_string();
    // the directory that contains the images that go on top of the post it notes
    pub static ref POST_IT_IMGS_DIR: String = "./web/static/assets/post-it-imgs/".to_string();

    // the directory that contains the images that go on the post it notes before they are processed
    pub static ref POST_IT_IMGS_IN_DIR: String = "./src/data/pictures/".to_string();
    // the directory that contains markdown files before they are rendered
    pub static ref MARKDOWN_IN_DIR: String = "./src/data/markdown/".to_string();
    // the directory that contains markdown files after they are rendered
    pub static ref MARKDOWN_OUT_DIR: String = "./web/static/assets/parsed_markdown/".to_string();
    // // the directory that contains images that go with the project description and info pages
    // pub static ref PROJECT_IMGS_DIR: String = "./web/static/assets/project_assets/".to_string();

    // standard error response for file not found
    pub static ref FILE_NOT_FOUND: Response = Response::new().status(404).text("file not found :(");
}

pub const PROJECTS: [&str; 1] = ["isospin"];
