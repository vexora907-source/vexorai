#[tauri::command]
pub fn load_projects() -> Result<Vec<String>, String> {
  Ok(vec![
    "Proyecto 1".to_string(),
    "Proyecto 2".to_string(),
    "Proyecto 3".to_string(),
  ])
}
