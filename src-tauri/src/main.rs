#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;
use tauri::command;
use dirs;

#[derive(serde::Deserialize)]
struct SidebarWidthPayload {
    width: u32,
}

#[command]
fn save_sidebar_width(payload: SidebarWidthPayload) -> Result<(), String> {
    let config_dir = dirs::config_dir().ok_or("Could not resolve config directory")?;
    let mut path = PathBuf::from(config_dir);
    path.push("csf-config.json");

    let data = format!(r#"{{ "sidebarWidth": {} }}"#, payload.width);

    fs::write(&path, data).map_err(|e| e.to_string())?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_sidebar_width])
        .run(tauri::generate_context!())
        .expect("failed to run tauri app");
}
