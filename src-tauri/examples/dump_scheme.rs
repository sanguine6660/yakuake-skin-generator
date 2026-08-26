//! Debug helper: prints the derived colorscheme for the parity fixture.
fn main() {
    let text = std::fs::read_to_string(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/tests/fixtures/config.json"
    ))
    .unwrap();
    let parsed = yakuake_skin_generator_lib::config::parse_skin_json(&text).unwrap();
    let scheme = parsed.config.terminal.clone().unwrap_or_else(|| {
        yakuake_skin_generator_lib::colorscheme::derive_colorscheme(&parsed.config)
    });
    print!(
        "{}",
        yakuake_skin_generator_lib::colorscheme::generate_colorscheme_text(&scheme)
    );
}
