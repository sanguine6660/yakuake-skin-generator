//! Yakuake Skin Generator - desktop application backend
//!
//! Provides native commands to the web frontend, most importantly
//! `install_skin` which writes generated skin files directly into the
//! user's Yakuake skins directory.

pub mod cli;
pub mod config;
pub mod generate;

use serde::Deserialize;
use std::fs;
use std::path::PathBuf;

#[derive(Deserialize)]
pub struct SkinFile {
    pub path: String,
    pub content: Vec<u8>,
}

const VALID_EXTENSIONS: [&str; 5] = ["svg", "skin", "json", "md", "txt"];

fn sanitize_folder_name(name: &str) -> Option<String> {
    let cleaned = name.to_lowercase().replace(
        |c: char| !c.is_ascii_lowercase() && !c.is_ascii_digit() && c != '_' && c != '-',
        "_",
    );
    if cleaned.is_empty() {
        None
    } else {
        Some(cleaned)
    }
}

fn is_safe_relative_path(path: &str) -> bool {
    if path.starts_with('/') || path.contains("..") || path.contains('\\') || path.is_empty() {
        return false;
    }
    match path.rsplit('.').next() {
        Some(ext) => VALID_EXTENSIONS.contains(&ext.to_lowercase().as_str()),
        None => false,
    }
}

#[tauri::command]
fn install_skin(folder_name: String, files: Vec<SkinFile>) -> Result<String, String> {
    let folder = sanitize_folder_name(&folder_name).ok_or("Invalid skin folder name")?;

    let base: PathBuf = dirs::home_dir()
        .ok_or("Could not resolve home directory")?
        .join(".local/share/yakuake/skins")
        .join(&folder);

    fs::create_dir_all(&base).map_err(|e| format!("Failed to create skin folder: {e}"))?;

    for file in &files {
        if !is_safe_relative_path(&file.path) {
            return Err(format!("Illegal file path in skin: {}", file.path));
        }
        let destination = base.join(&file.path);
        if let Some(parent) = destination.parent() {
            fs::create_dir_all(parent).map_err(|e| format!("Failed to create folder: {e}"))?;
        }
        fs::write(&destination, &file.content)
            .map_err(|e| format!("Failed to write {}: {e}", file.path))?;
    }

    Ok(format!("Skin installed to {}", base.display()))
}

#[cfg_attr(mobile, tauri_mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![install_skin])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sanitizes_folder_names() {
        assert_eq!(
            sanitize_folder_name("My Cool Skin! 2.0"),
            Some("my_cool_skin__2_0".to_string())
        );
        // Mirrors the TypeScript sanitizer: invalid chars become underscores.
        assert_eq!(sanitize_folder_name("   "), Some("___".to_string()));
        assert_eq!(sanitize_folder_name(""), None);
    }

    #[test]
    fn rejects_unsafe_paths() {
        assert!(!is_safe_relative_path("../escape.svg"));
        assert!(!is_safe_relative_path("/absolute.svg"));
        assert!(!is_safe_relative_path("file.exe"));
        assert!(is_safe_relative_path("title/config_up.svg"));
    }
}
