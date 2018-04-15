#[macro_use]
extern crate clap;
extern crate logbook;
extern crate mustache;

use std::fs;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::path::Path;
use std::path::PathBuf;
use std::str;

use clap::App;

use logbook::divinglog;
use logbook::dive::Log;

const TEMPLATE: &str = "./templates/fipsas/index.mustache";

fn read_file(path: String) -> String {
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

fn main() {
    let yaml = load_yaml!("cli.yml");
    let config = App::from_yaml(yaml).get_matches();

    let file = config.value_of("INPUT").unwrap();

    let contents = read_file(String::from(file));
    let template = read_file(String::from(TEMPLATE));
    let template = mustache::compile_str(&template).unwrap();

    let dive: Log = divinglog::parse(String::from(contents.trim()));
    //    println!("{:#?}", dive);

    let mut rendered = vec![];
    template
        .render(&mut rendered, &dive)
        .expect("Failed to render");

    let rendered = str::from_utf8(&rendered).unwrap();

    // Saving output
    let path = config.value_of("dest").unwrap_or("./");
    let path = Path::new(path);
    let index_file = path.join("index.html");
    fs::create_dir_all(path).unwrap();
    write_file(index_file, &rendered);
}
