use std::fmt::Display;

use afire::prelude::*;


// sh.rs - shorthand.rs name abbreviated for obvious reasons

/// return an html response
pub fn _html_res<T: Display>(string: T) -> Response {
    return Response::new().text(string).content(Content::HTML);
}

/// return an error response to a request - replace with an actual error page later maybe
pub fn err_temp<T: Display>(string: T) -> Response {
    return Response::new().text(format!("Something went wrong! error: {}", string));
}

#[macro_export]
macro_rules! print_list {
    () => {};
    ($item:expr, $($tail:tt)*) => {{
        print!("{}", $item);
        $crate::print_list!($($tail)*);
    }};
}

/// basically excecute but bad
/// but mostly execute but shorter
#[macro_export]
macro_rules! log {
    ($($command:expr),*) => {{
        use crossterm::style::Stylize;
        print!(
            "{}",
            crossterm::style::style(format!("[{}] ", chrono::Utc::now().time().format("%H:%M:%S"))).green()
        );
        $crate::print_list!($($command,)*);
        println!();
    }};
}

/// runs log with "INFO:" before it
#[macro_export]
macro_rules! info{
    ($($command:expr),*) => {{
        $crate::log!("INFO:".black().on_white(), " ", $($command),*);
    }}
}

/// runs log with "WARN:" before it
#[macro_export]
macro_rules! warn{
    ($($command:expr),*) => {{
        $crate::log!("WARN:".black().on_yellow(), " ", $($command),*);
    }}
}
