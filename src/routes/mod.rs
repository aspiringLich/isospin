use crate::Server;

mod home;

pub fn attach(server: &mut Server) {
    home::attach(server);
}
