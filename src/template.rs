use std::default::default;
use std::fs::read_to_string;
use std::io;
use std::fs;
use std::str;

use anyhow::Context;

use crate::config::BAKED_TEMPLATE_DIR;
use crate::routes::html::get_template;
use crate::routes::html::read_template;

/// A struct to facilitate turning a HTML template file
/// into the renderred HTML file
#[derive(Debug, Clone, Default)]
pub struct TemplateBuilder<'a> {
    sections: Vec<&'a str>,
    snippets: Vec<String>,
}

impl<'a> TemplateBuilder<'a> {
    pub fn from_template(template: &'a str) -> anyhow::Result<Self> {
        let mut out = Self::default();

        let mut split = template.split("{{");
        out.sections.push(split.next().context("Expected file to not be empty")?);
        for section in split {
            let mut index = None;
            let mut iter = section.chars().enumerate();
            loop {
                let Some((i, c)) = iter.next() else {
                    break;
                };

                if c.is_whitespace() {
                    break;
                }
                if c == '}' && let Some((_, '}')) = iter.next() {
                    index = Some(i);
                    break;
                }
            }

            if let Some(i) = index {
                let snippet = section.get(0..i);
                let section = section.get(i + 2..);

                out.sections.push(section.context("error when getting section str")?);
                out.snippets.push(snippet.context("error when getting snippet str")?.to_string());
            }
        }

        Ok(out)
    }

    pub fn replace<T: ToString>(mut self, from: &str, to: T) -> Self {
        let with_string = to.to_string();

        let mut any = false;

        for s in self.snippets.iter_mut() {
            if s == from {
                any = true;
                *s = with_string.clone();
            }
        }

        if !any {
            panic!("Did not find {{{}}} in the specified template!", from);
        }

        self
    }

    pub fn build(mut self) -> String {
        let mut out = String::new();
        out.push_str(self.sections.first().unwrap());

        for i in 0..self.snippets.len() {
            out.push_str(&self.snippets[i]);
            out.push_str(self.sections[i + 1]);
        }

        out
    }
}

#[test]
pub fn test_template_builder() -> anyhow::Result<()> {
    let builder = TemplateBuilder::from_template("blah blah {{REPLACE}} stuff")?;

    assert_eq!(builder.sections, vec!["blah blah ", " stuff"]);
    assert_eq!(builder.snippets, vec!["REPLACE".to_string()]);

    let out = builder.replace("REPLACE", "test").build();

    assert_eq!(out, "blah blah test stuff");

    Ok(())
}