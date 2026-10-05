#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      commands::cv::export_cv_pdf,
      commands::projects::load_projects
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
