#[macro_use]
extern crate clap;
extern crate logbook;

use std::path::Path;
use clap::App;

use logbook::render;
use logbook::render_empty;

fn main() {
    let yaml = load_yaml!("cli.yml");
    let config = App::from_yaml(yaml).get_matches();

    let path = config.value_of("dest").unwrap_or("./");
    let path = Path::new(path).to_path_buf();

    let file = config.value_of("INPUT");
    match file {
        Some(f) => render(f, &path),
        None => render_empty(&path),
    }

    println!("Exported in {:?}", file, path);
}
