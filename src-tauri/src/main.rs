// Prevents an additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Full argv including argv[0]: clap consumes the program name itself.
    let args: Vec<String> = std::env::args().collect();
    if args.len() > 1 {
        // Headless CLI mode: validate, compile, --help/--version, or `gui`
        let code = yakuake_skin_generator_lib::cli::run(&args, yakuake_skin_generator_lib::run);
        std::process::exit(code);
    }

    yakuake_skin_generator_lib::run()
}
