extern crate chrono;
extern crate mustache;
extern crate serde;
#[macro_use]
extern crate serde_derive;
extern crate serde_xml_rs;

pub mod divinglog;
pub mod dive;

use dive::Log;

use std::fs;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::path::PathBuf;
use std::str;

const TEMPLATE: &str = "./templates/fipsas/src/index.mustache";
const OUT_FILE_NAME: &str = "index.html";

fn read_file(path: &str) -> String {
    let f = File::open(path).expect("File not found");
    let mut contents = String::new();
    let mut buf_reader = BufReader::new(f);
    let _ = buf_reader.read_to_string(&mut contents);

    contents
}

fn write_file(path: PathBuf, content: &str) {
    let mut f = File::create(path).expect("Unable to create file");
    f.write_all(content.as_bytes())
        .expect("Unable to write data");
}

pub fn render(file: &str, path: &PathBuf) {
    let contents = read_file(file);
    let template = read_file(TEMPLATE);
    let template = mustache::compile_str(&template).unwrap();

    let dive: Log = divinglog::parse(String::from(contents.trim()));

    let mut rendered = vec![];
    template
        .render(&mut rendered, &dive)
        .expect("Failed to render");

    let index_file = path.join(OUT_FILE_NAME);

    let rendered = str::from_utf8(&rendered).unwrap();

    // Saving output

    fs::create_dir_all(path).unwrap();
    write_file(index_file, &rendered);
}

pub fn render_empty(path: &PathBuf) {
}
