#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs::{OpenOptions, read_to_string, create_dir_all, copy};
use std::io::Write;
use serde::{Serialize, Deserialize};
use tauri::AppHandle;

#[derive(Serialize, Deserialize, Clone)]
struct Note {
    id: u64,
    title: String,
}

fn get_file_path(app_handle: &AppHandle) -> Result<std::path::PathBuf, String> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or("Could not resolve app data directory")?;
    let file_path = app_dir.join("backData.json");

    if let Some(parent) = file_path.parent() {
        create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    Ok(file_path)
}

fn copy_initial_file(app_handle: &AppHandle) -> Result<(), String> {
    let target_path = get_file_path(app_handle)?;
    let source_path = std::path::Path::new("ToDo/backData.json"); // Path to your initial file

    if !target_path.exists() && source_path.exists() {
        copy(source_path, target_path).map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
fn write_to_json(note: Note, app_handle: AppHandle) -> Result<(), String> {
    let file_path = get_file_path(&app_handle)?;

    let mut notes: Vec<Note> = match read_to_string(&file_path) {
        Ok(data) => serde_json::from_str(&data).unwrap_or_else(|_| Vec::new()),
        Err(_) => Vec::new(),
    };

    notes.push(note);

    let json_data = serde_json::to_string(&notes).map_err(|e| e.to_string())?;
    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(&file_path)
        .map_err(|e| e.to_string())?;

    file.write_all(json_data.as_bytes())
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn read_from_json(app_handle: AppHandle) -> Result<Vec<Note>, String> {
    let file_path = get_file_path(&app_handle)?;

    let notes: Vec<Note> = match read_to_string(&file_path) {
        Ok(data) => serde_json::from_str(&data).map_err(|e| e.to_string())?,
        Err(_) => Vec::new(),
    };

    Ok(notes)
}

#[tauri::command]
fn delete_from_json(id: u64, app_handle: AppHandle) -> Result<(), String> {
    let file_path = get_file_path(&app_handle)?;

    let mut notes: Vec<Note> = match read_to_string(&file_path) {
        Ok(data) => serde_json::from_str(&data).unwrap_or_else(|_| Vec::new()),
        Err(_) => Vec::new(),
    };

    notes.retain(|note| note.id != id);

    let json_data = serde_json::to_string(&notes).map_err(|e| e.to_string())?;
    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(&file_path)
        .map_err(|e| e.to_string())?;

    file.write_all(json_data.as_bytes())
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn edit_in_json(id: u64, new_title: String, app_handle: AppHandle) -> Result<(), String> {
    let file_path = get_file_path(&app_handle)?;

    let mut notes: Vec<Note> = match read_to_string(&file_path) {
        Ok(data) => serde_json::from_str(&data).unwrap_or_else(|_| Vec::new()),
        Err(_) => Vec::new(),
    };

    if let Some(note) = notes.iter_mut().find(|note| note.id == id) {
        note.title = new_title;
    }

    let json_data = serde_json::to_string(&notes).map_err(|e| e.to_string())?;
    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(&file_path)
        .map_err(|e| e.to_string())?;

    file.write_all(json_data.as_bytes())
        .map_err(|e| e.to_string())?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle();
            // Copy the initial file to the app data directory
            copy_initial_file(&app_handle)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![write_to_json, read_from_json, delete_from_json, edit_in_json])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
