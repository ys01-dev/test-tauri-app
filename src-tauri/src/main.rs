// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(non_snake_case)]

mod mongo;
mod pg;

use mongo::{getMongoClient, Uma_home, Uma_live};
use mongodb::bson::doc;
use pg::{chara_name_data, dress_name_data, getCharaDml, getConnStr, getDressDml};
use postgres::{Client, NoTls};
use futures::TryStreamExt;

#[tauri::command]
fn getCharaData(name: String) -> Result<String, pg::PGError> {
    let mut client = Client::connect(getConnStr().as_str(), NoTls)?;
    let data: Vec<chara_name_data> = client
        .query(getCharaDml(&name).as_str(), &[])?
        .iter()
        .map(|row| chara_name_data {
            id: row.get(0),
            chara_name: row.get(1),
            chara_voice: row.get(2),
            birth_year: row.get(3),
            birth_month: row.get(4),
            birth_day: row.get(5),
            sex: row.get(6),
            height: row.get(7),
            bust: row.get(8),
            scale: row.get(9),
            skin: row.get(10),
            chara_category: row.get(11),
        })
        .collect();
    Ok(serde_json::to_string_pretty(&data)?)
}

#[tauri::command]
fn getDressData(name: String) -> Result<String, pg::PGError> {
    let mut client = Client::connect(getConnStr().as_str(), NoTls)?;
    let data: Vec<dress_name_data> = client
        .query(getDressDml(&name).as_str(), &[])?
        .iter()
        .map(|row| dress_name_data {
            id: row.get(0),
            dress_name: row.get(1),
            dress_desc: row.get(2),
            chara_id: row.get(3),
            chara_name: row.get(4),
        })
        .collect();
    Ok(serde_json::to_string_pretty(&data)?)
}

#[tauri::command]
async fn getHomePreset() -> Result<String, mongo::MongoError> {
    let coll = getMongoClient().await?.database("local").collection::<Uma_home>("uma_home");
    let data = coll.find(doc! {}, None).await?.try_collect::<Vec<Uma_home>>().await?;
    Ok(serde_json::to_string(&data)?)
}

#[tauri::command]
async fn getLivePreset() -> Result<String, mongo::MongoError> {
    let coll = getMongoClient().await?.database("local").collection::<Uma_live>("uma_live");
    let data = coll.find(doc! {}, None).await?.try_collect::<Vec<Uma_live>>().await?;
    Ok(serde_json::to_string(&data)?)
}

fn main() {
    tauri::Builder::default()
        // .setup(|app| {
        //     let pool = pg::getpool();
        //     app.manage(pool);
        //     Ok(())
        // })
        .invoke_handler(tauri::generate_handler![
            getCharaData,
            getDressData,
            getHomePreset,
            getLivePreset
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
