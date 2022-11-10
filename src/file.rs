use std::{cmp::Ordering, fs};

/// will reparse if:
///  - theres no parsed file
///  - if the orig file has been modified more recently
pub fn need_rebuild(path_orig: &str, path_parsed: &str) -> bool {
    // make sure that the parsed file isnt more recent, cuz then we need to rebuild
    let mut mod_orig = None;
    if let Ok(metadata) = fs::metadata(&path_orig) {
        mod_orig = Some(metadata.modified())
    }
    let mut mod_parsed = None;
    if let Ok(metadata) = fs::metadata(&path_parsed) {
        mod_parsed = Some(metadata.modified())
    }

    if let (Some(Ok(mod_orig)), Some(Ok(mod_parsed))) = (&mod_orig, &mod_parsed) {
        // if the md has been modified more recently than the html we need to rebuild anyway
        mod_parsed.cmp(&mod_orig) == Ordering::Less
    } else {
        // if mod_parsed.is_none() {
        //     eprintln!("bababooey: {}", path_parsed);
        // }
        mod_parsed.is_none()
    }
}

pub trait PathMethods {
    fn get(&self) -> String;

    /// Strip the path off a string like "xxxx.ft" -> "xxxx"
    /// TODO: make it not bad (like ignore .gitignore n shiz)
    fn strip_filetype(&self) -> String {
        assert!(self.get().chars().nth(0) != Some('.'));
        self.get().split_once(".").unwrap().0.to_string()
    }

    /// get the top folder of a path like "/template/djaiksj.html" -> "template"
    fn strip_top_folder(&self) -> String {
        assert!(self.get().chars().nth(0) == Some('/'));
        self.get()
            .chars()
            .skip(1)
            .take_while(|&ch| ch != '/')
            .collect()
    }
}

impl PathMethods for String {
    fn get(&self) -> String {
        self.clone()
    }
}
