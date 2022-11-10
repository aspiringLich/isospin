use crate::Server;
use afire::prelude::*;

mod blog;
mod home;
mod html;
mod md;
mod root;

pub fn attach(server: &mut Server) {
    home::attach(server);
    root::Root.attach(server);
    root::attach(server);
    blog::attach(server);
}
