use lazy_static::lazy_static;

lazy_static! {
    // the directory that contains the html template files
    pub static ref TEMPLATE_DIR: String = "./web/template/".to_string();
    // the directory that contains the assets for the website
    pub static ref ASSET_DIR: String = "./web/static/assets/".to_string();

    // the directory that contains the post it svgs: basically the post it notes themselves
    pub static ref POST_ITS_DIR: String = "./web/static/assets/post-its".to_string();
    // the directory that contains the images that go on top of the post it notes
    pub static ref POST_IT_IMGS_DIR: String = "./web/static/assets/post-it-imgs".to_string();

    // the directory that contains the images that go on the post it notes before they are processed
    pub static ref POST_IT_IMGS_IN_DIR: String = "./src/data/pictures/".to_string();
}
