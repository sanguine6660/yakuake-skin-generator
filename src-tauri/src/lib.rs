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
use std::path::{Path, PathBuf};

#[derive(Deserialize)]
pub struct SkinFile {
    pub path: String,
    pub content: Vec<u8>,
}

const VALID_EXTENSIONS: [&str; 5] = ["svg", "skin", "json", "md", "txt"];

pub fn sanitize_folder_name(name: &str) -> Option<String> {
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

pub fn is_safe_relative_path(path: &str) -> bool {
    if path.starts_with('/') || path.contains("..") || path.contains('\\') || path.is_empty() {
        return false;
    }
    match path.rsplit('.').next() {
        Some(ext) => VALID_EXTENSIONS.contains(&ext.to_lowercase().as_str()),
        None => false,
    }
}

/// Writes validated skin files into `<skins_root>/<folder>`.
///
/// `skins_root` defaults to `~/.local/share/yakuake/skins` when `None`
/// (the injection point used by tests). Returns the installation path.
pub fn install_skin_files(
    folder_name: &str,
    files: &[SkinFile],
    skins_root: Option<&Path>,
) -> Result<PathBuf, String> {
    let folder = sanitize_folder_name(folder_name).ok_or("Invalid skin folder name")?;

    let base: PathBuf = match skins_root {
        Some(root) => root.join(&folder),
        None => dirs::home_dir()
            .ok_or("Could not resolve home directory")?
            .join(".local/share/yakuake/skins")
            .join(&folder),
    };

    if files.is_empty() {
        return Err("Archive contains no skin files".into());
    }

    // Validate every path before touching the filesystem so a rejected
    // archive leaves nothing behind.
    for file in files {
        if !is_safe_relative_path(&file.path) {
            return Err(format!("Illegal file path in skin: {}", file.path));
        }
    }

    fs::create_dir_all(&base).map_err(|e| format!("Failed to create skin folder: {e}"))?;

    for file in files {
        let destination = base.join(&file.path);
        if let Some(parent) = destination.parent() {
            fs::create_dir_all(parent).map_err(|e| format!("Failed to create folder: {e}"))?;
        }
        fs::write(&destination, &file.content)
            .map_err(|e| format!("Failed to write {}: {e}", file.path))?;
    }

    Ok(base)
}

#[tauri::command]
fn install_skin(folder_name: String, files: Vec<SkinFile>) -> Result<String, String> {
    let base = install_skin_files(&folder_name, &files, None)?;
    Ok(format!("Skin installed to {}", base.display()))
}

#[cfg_attr(mobile, tauri_mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
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

    fn temp_dir(name: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!(
            "ysg-test-{name}-{}",
            std::process::id()
                + std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .subsec_nanos() as u32
        ));
        fs::create_dir_all(&dir).unwrap();
        dir
    }

    #[test]
    fn install_writes_files_and_sanitizes_folder() {
        let root = temp_dir("install");
        let files = vec![
            SkinFile {
                path: "title.skin".into(),
                content: b"[Description]".to_vec(),
            },
            SkinFile {
                path: "title/focus_up.svg".into(),
                content: b"<svg/>".to_vec(),
            },
        ];
        let base = install_skin_files("My Skin!", &files, Some(&root)).unwrap();
        assert_eq!(base, root.join("my_skin_"));
        assert!(base.join("title.skin").exists());
        assert!(base.join("title/focus_up.svg").exists());
        fs::remove_dir_all(&root).unwrap();
    }

    #[test]
    fn install_rejects_illegal_paths_and_empty_archives() {
        let root = temp_dir("illegal");
        let evil = vec![SkinFile {
            path: "../escape.svg".into(),
            content: vec![],
        }];
        assert!(install_skin_files("x", &evil, Some(&root)).is_err());

        let exe = vec![SkinFile {
            path: "virus.exe".into(),
            content: vec![],
        }];
        assert!(install_skin_files("x", &exe, Some(&root)).is_err());

        assert!(install_skin_files("x", &[], Some(&root)).is_err());
        assert!(install_skin_files("", &evil, Some(&root)).is_err());
        // Nothing was written outside or inside the root.
        assert_eq!(fs::read_dir(&root).unwrap().count(), 0);
        fs::remove_dir_all(&root).unwrap();
    }

    #[test]
    fn install_overwrites_existing_files() {
        let root = temp_dir("overwrite");
        let files = vec![SkinFile {
            path: "tabs.skin".into(),
            content: b"v1".to_vec(),
        }];
        install_skin_files("skin", &files, Some(&root)).unwrap();
        let updated = vec![SkinFile {
            path: "tabs.skin".into(),
            content: b"v2".to_vec(),
        }];
        install_skin_files("skin", &updated, Some(&root)).unwrap();
        assert_eq!(
            fs::read(root.join("skin/tabs.skin")).unwrap(),
            b"v2".to_vec()
        );
        fs::remove_dir_all(&root).unwrap();
    }
}
