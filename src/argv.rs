pub struct Options {
    pub filename: String,
}

impl Options {
    pub fn new(args: &[String]) -> Result<Options, &'static str> {
        if args.len() <= 1 {
            return Err("not enough arguments");
        }
        let filename = args[1].clone();

        Ok(Options { filename })
    }
}



#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn options_filename() {
        let args: Vec<String> = vec![
            "bin".to_string(),
            "foo".to_string(),
            "baz".to_string()];
        let options = Options::new(&args).unwrap_or_else(|err| {
            panic!(err)
        });
        assert_eq!(options.filename, "foo");
    }

    #[test]
    #[should_panic(expected = "not enough arguments")]
    fn options_empty() {
        let args: Vec<String> = vec!["bin".to_string()];
        Options::new(&args).unwrap_or_else(|err| {
            panic!(err)
        });
    }
}