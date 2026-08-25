//! Headless command-line interface: validate skin metadata files and
//! compile them into distributable `.tar.gz` skin archives.

use clap::Parser;
use std::path::{Path, PathBuf};

#[derive(Parser, Debug)]
#[command(
    name = "yakuake-skin-generator",
    version = env!("CARGO_PKG_VERSION"),
    about = "Create, validate and compile Yakuake terminal skins",
    long_about = None,
    after_help = "Run without arguments to open the graphical interface."
)]
pub struct Cli {
    /// Validate a skin metadata JSON file
    #[arg(
        short,
        long,
        value_name = "FILE",
        conflicts_with_all = ["input", "gui"]
    )]
    pub validate: Option<PathBuf>,

    /// Compile a skin metadata JSON into a .tar.gz skin archive
    #[arg(
        short,
        long,
        value_name = "FILE",
        conflicts_with_all = ["validate", "gui"]
    )]
    pub input: Option<PathBuf>,

    /// Output path for the compiled archive (default: <skin name>.tar.gz)
    #[arg(short, long, value_name = "FILE", requires = "input")]
    pub output: Option<PathBuf>,

    /// Open the graphical interface
    #[arg(long, conflicts_with_all = ["validate", "input"])]
    pub gui: bool,
}

fn parse_skin_file(path: &Path) -> Result<crate::config::ParsedSkin, String> {
    let text = std::fs::read_to_string(path)
        .map_err(|e| format!("Cannot read {}: {e}", path.display()))?;
    crate::config::parse_skin_json(&text)
}

fn validate_metadata(path: &Path) -> Result<(), String> {
    let parsed = parse_skin_file(path)?;

    let author = if parsed.meta.author.is_empty() {
        "unknown"
    } else {
        &parsed.meta.author
    };
    println!(
        "✓ Metadata parsed: \"{}\" by {author}",
        parsed.meta.skin_name
    );

    if parsed.meta.skin_name.trim().is_empty() {
        return Err("Skin name is empty".into());
    }
    println!("✓ Skin name valid");

    let colors = &parsed.config.global.colors;
    for (name, hex) in [
        ("background", &colors.bg),
        ("selected", &colors.selected),
        ("text", &colors.text),
        ("dim", &colors.dim),
        ("terminal background", &colors.konsole_background),
    ] {
        let clean = hex.trim_start_matches('#');
        if clean.len() != 6 || !clean.chars().all(|c| c.is_ascii_hexdigit()) {
            return Err(format!(
                "Global color '{name}' is not a valid hex color: {hex}"
            ));
        }
    }
    println!("✓ Global configuration valid");

    if parsed.config.title.border_width < 0 {
        return Err("Border width cannot be negative".into());
    }
    if parsed.config.title.text_content.is_empty() {
        return Err("Title text is empty".into());
    }
    println!("✓ Title bar configuration valid");

    if parsed.config.tabs.tabs_x < 0 || parsed.config.tabs.tabs_y < 0 {
        return Err("Tab position cannot be negative".into());
    }
    println!("✓ Tabs bar configuration valid");

    let roles = ["settings", "maximize", "close", "plus", "minus", "lock"];
    let embedded = roles
        .iter()
        .filter(|role| parsed.icon_markup.contains_key(**role))
        .count();
    println!("✓ Icon markup: {embedded}/{} roles embedded", roles.len());

    println!();
    println!("No issues found — metadata is valid.");
    Ok(())
}

fn compile_archive(input: &Path, output: Option<PathBuf>) -> Result<(), String> {
    let parsed = parse_skin_file(input)?;

    let icon_markup = |role: &str| parsed.icon_markup.get(role).cloned();
    let files = crate::generate::prepare_skin_files(&parsed.config, &icon_markup);

    let folder_name = parsed.meta.skin_name.to_lowercase().replace(
        |c: char| !c.is_ascii_lowercase() && !c.is_ascii_digit() && c != '_' && c != '-',
        "_",
    );
    let output = output.unwrap_or_else(|| PathBuf::from(format!("{folder_name}.tar.gz")));

    let tar_buffer = {
        let mut builder = tar::Builder::new(Vec::new());
        for (path, content) in &files {
            let mut header = tar::Header::new_gnu();
            header.set_size(content.len() as u64);
            header.set_mode(0o644);
            header.set_cksum();
            builder
                .append_data(
                    &mut header,
                    format!("{folder_name}/{path}"),
                    content.as_bytes(),
                )
                .map_err(|e| format!("Failed to pack archive: {e}"))?;
        }
        builder
            .into_inner()
            .map_err(|e| format!("Failed to finalize archive: {e}"))?
    };

    let mut gz = flate2::write::GzEncoder::new(Vec::new(), flate2::Compression::default());
    std::io::Write::write_all(&mut gz, &tar_buffer)
        .map_err(|e| format!("Compression failed: {e}"))?;
    let compressed_bytes = gz
        .finish()
        .map_err(|e| format!("Compression failed: {e}"))?;

    std::fs::write(&output, &compressed_bytes)
        .map_err(|e| format!("Cannot write {}: {e}", output.display()))?;

    println!();
    println!(
        "✓ Compiled {} files → {} ({:.1} KB)",
        files.len(),
        output.display(),
        compressed_bytes.len() as f64 / 1024.0
    );
    Ok(())
}

/// Runs the headless CLI. `args` must be the full argv, including the
/// program name at index 0 (clap consumes it as the binary name).
/// `launch_gui` opens the graphical interface.
/// Returns a process exit code.
pub fn run(args: &[String], launch_gui: impl FnOnce()) -> i32 {
    let cli = match Cli::try_parse_from(args) {
        Ok(cli) => cli,
        Err(error) => {
            let _ = error.print();
            return if error.use_stderr() { 2 } else { 0 };
        }
    };

    if cli.gui {
        launch_gui();
        return 0;
    }

    if let Some(path) = &cli.validate {
        return match validate_metadata(path) {
            Ok(()) => 0,
            Err(message) => {
                eprintln!("✗ {message}");
                1
            }
        };
    }

    if let Some(input) = &cli.input {
        return match compile_archive(input, cli.output) {
            Ok(()) => 0,
            Err(message) => {
                eprintln!("✗ {message}");
                1
            }
        };
    }

    launch_gui();
    0
}

#[cfg(test)]
mod tests {
    use super::*;

    fn args(tail: &[&str]) -> Vec<String> {
        std::iter::once("yakuake-skin-generator")
            .chain(tail.iter().copied())
            .map(String::from)
            .collect()
    }

    #[test]
    fn version_flag_prints_and_exits_without_gui() {
        let code = run(&args(&["--version"]), || {
            panic!("GUI launched despite --version")
        });
        assert_eq!(code, 0);
    }

    #[test]
    fn help_flag_exits_without_gui() {
        let code = run(&args(&["--help"]), || panic!("GUI launched despite --help"));
        assert_eq!(code, 0);
    }

    #[test]
    fn unknown_flag_fails_without_gui() {
        let code = run(&args(&["--bogus-flag"]), || {
            panic!("GUI launched despite unknown flag")
        });
        assert_eq!(code, 2);
    }

    #[test]
    fn validate_missing_file_fails_without_gui() {
        let code = run(&args(&["-v", "/nonexistent/skin.json"]), || {
            panic!("GUI launched despite validate flag")
        });
        assert_eq!(code, 1);
    }
}
