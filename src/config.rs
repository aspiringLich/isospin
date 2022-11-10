/// the directory that contains the html template files
/// (.html)
#[allow(dead_code)]
pub const TEMPLATE_DIR: &str = "./web/template";

/// the directory that contains the baked html
/// (.html)
#[allow(dead_code)]
pub const BAKED_TEMPLATE_DIR: &str = "./web/template/baked";

/// the directory that contains the assets for the website
/// (.png .gif .svg etc.)
#[allow(dead_code)]
pub const ASSET_DIR: &str = "./web/static/assets";

/// the directory that contains the post it svgs: basically the post it notes themselves
/// (.svg)
#[allow(dead_code)]
pub const POST_ITS_DIR: &str = "./web/static/assets/post-its";

/// the directory that contains the images that go on top of the post it notes
/// (.png)
#[allow(dead_code)]
pub const POST_IT_IMGS_DIR: &str = "./web/static/assets/post-it-imgs";

/// the directory that contains the images that go on the post it notes before they are processed
/// (.png)
#[allow(dead_code)]
pub const POST_IT_IMGS_IN_DIR: &str = "./src/data/raw_pictures";

/// the directory that contains markdown files before they are rendered
/// (.md)
#[allow(dead_code)]
pub const MARKDOWN_IN_DIR: &str = "./src/data/markdown";

/// the directory that contains the files pertianing to the home page display of projects
/// (.html, .png)
#[allow(dead_code)]
pub const PROJECTS_DIR: &str = "./web/static/assets/projects";

/// the list of projects that i want to generate icon / descriptions for
#[allow(dead_code)]
pub const PROJECTS: [&str; 1] = ["isospin"];
