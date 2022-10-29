use crate::Server;
use afire::prelude::*;

mod home;
mod html;
mod md;
mod root;

pub fn attach(server: &mut Server) {
    home::attach(server);
    root::root.attach(server);
}
