#[tauri::command]
pub fn export_cv_pdf() -> Result<String, String> {
  Ok("CV exportado en formato PDF desde Tauri".to_string())
}
