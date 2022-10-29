use std::{fmt::Display, io};

use afire::prelude::*;

// sh.rs - shorthand.rs name abbreviated for obvious reasons

/// return an html response
pub fn html_res<T: Display>(string: T) -> Response {
    return Response::new().text(string).content(Content::HTML);
}

/// return an error response to a request - replace with an actual error page later maybe
pub fn err_temp<T: Display>(string: T) -> Response {
    return Response::new().text(format!("Something went wrong! error: {}", string));
}
