extern crate logbook;
extern crate mustache;

use std::env;
use std::process;
use std::io;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;

use logbook::argv::Options;
use logbook::divinglog;
use logbook::dive::Log;

const TEMPLATE: &str = "./template/index.mustache";

fn read_file(path:String) -> String {
    let f = File::open(path).expect("File not found");
    let mut contents = String::new();
    let mut buf_reader = BufReader::new(f);
    let _ = buf_reader.read_to_string(&mut contents);

    contents
}

fn main() {
    let args: Vec<String> = env::args().collect();

    let options = Options::new(&args).unwrap_or_else(|err| {
        println!("Problem parsing arguments: {}", err);
        process::exit(1);
    });

    let contents = read_file(options.filename);
    let template = read_file(String::from(TEMPLATE));
    let template = mustache::compile_str(&template).unwrap();



   // println!("---------");
   // println!("{}", contents);
   // println!("---------");

   //println!("{}", template);

   let dive:Log =  divinglog::parse(String::from(contents.trim()));
   println!("{:#?}", dive);
    template.render(&mut io::stdout(), &dive).unwrap();
}
