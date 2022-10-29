// the directory that contains the html template files
#[allow(dead_code)]
pub const TEMPLATE_DIR: &str = "./web/template";

// the directory that contains the assets for the website
#[allow(dead_code)]
pub const ASSET_DIR: &str = "./web/static/assets";

// the directory that contains the post it svgs: basically the post it notes themselves
#[allow(dead_code)]
pub const POST_ITS_DIR: &str = "./web/static/assets/post-its";

// the directory that contains the images that go on top of the post it notes
#[allow(dead_code)]
pub const POST_IT_IMGS_DIR: &str = "./web/static/assets/post-it-imgs";

// the directory that contains the images that go on the post it notes before they are processed
#[allow(dead_code)]
pub const POST_IT_IMGS_IN_DIR: &str = "./src/data/pictures";

// the directory that contains markdown files before they are rendered
#[allow(dead_code)]
pub const MARKDOWN_IN_DIR: &str = "./src/data/markdown";

// the directory that contains markdown files after they are rendered
#[allow(dead_code)]
pub const MARKDOWN_OUT_DIR: &str = "./web/static/assets/parsed_markdown";

/// the list of projects that i want to generate icon / descriptions for
#[allow(dead_code)]
pub const PROJECTS: [&str; 1] = ["isospin"];
