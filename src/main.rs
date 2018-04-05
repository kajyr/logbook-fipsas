#[macro_use]
extern crate clap;
extern crate logbook;
extern crate mustache;

use std::io;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;

use clap::App;

use logbook::divinglog;
use logbook::dive::Log;

const TEMPLATE: &str = "./template/index.mustache";

fn read_file(path: String) -> String {
    let f = File::open(path).expect("File not found");
    let mut contents = String::new();
    let mut buf_reader = BufReader::new(f);
    let _ = buf_reader.read_to_string(&mut contents);

    contents
}

fn main() {
    let yaml = load_yaml!("cli.yml");
    let matches = App::from_yaml(yaml).get_matches();

    match matches.occurrences_of("v") {
        0 => println!("No verbose info"),
        1 => println!("Some verbose info"),
        2 => println!("Tons of verbose info"),
        3 | _ => println!("Don't be crazy"),
    }

    let file = matches.value_of("INPUT").unwrap();

    let contents = read_file(String::from(file));
    let template = read_file(String::from(TEMPLATE));
    let template = mustache::compile_str(&template).unwrap();

    // println!("---------");
    // println!("{}", contents);
    // println!("---------");

    //println!("{}", template);

    let dive: Log = divinglog::parse(String::from(contents.trim()));
    println!("{:#?}", dive);
    template.render(&mut io::stdout(), &dive).unwrap();
}
