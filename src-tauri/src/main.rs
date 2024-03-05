// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(non_snake_case)]

mod mongo;
mod pg;
mod config_type;

use bson::oid::ObjectId;
use futures::TryStreamExt;
use mongo::{getMongoClient, param_Uma_home, param_Uma_live, Uma_home, Uma_live};
use mongodb::bson::doc;
use pg::{chara_name_data, dress_name_data, getCharaDml, getConnStr, getDressDml};
use postgres::{Client, NoTls};

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
    let coll = getMongoClient()
        .await?
        .database("local")
        .collection::<Uma_home>("uma_home");
    let data = coll
        .find(doc! {}, None)
        .await?
        .try_collect::<Vec<Uma_home>>()
        .await?;
    Ok(serde_json::to_string(&data)?)
}

#[tauri::command]
async fn getLivePreset() -> Result<String, mongo::MongoError> {
    let coll = getMongoClient()
        .await?
        .database("local")
        .collection::<Uma_live>("uma_live");
    let data = coll
        .find(doc! {}, None)
        .await?
        .try_collect::<Vec<Uma_live>>()
        .await?;
    Ok(serde_json::to_string(&data)?)
}

#[tauri::command]
async fn saveHomePreset(param: param_Uma_home) -> Result<String, mongo::MongoError> {
    getMongoClient()
        .await?
        .database("local")
        .collection::<param_Uma_home>("uma_home")
        .insert_one(param, None)
        .await?;
    Ok("successfully saved a preset".into())
}

#[tauri::command]
async fn saveLivePreset(param: param_Uma_live) -> Result<String, mongo::MongoError> {
    getMongoClient()
        .await?
        .database("local")
        .collection::<param_Uma_live>("uma_live")
        .insert_one(param, None)
        .await?;
    Ok("successfully saved a preset".into())
}

#[tauri::command]
async fn updateHomePreset(param: Uma_home) -> Result<String, mongo::MongoError> {
    getMongoClient()
        .await?
        .database("local")
        .collection::<Uma_home>("uma_home")
        .update_one(
            doc! {"_id": &param._id},
            doc! {"$set": bson::to_document(&param)?},
            None,
        )
        .await?;
    Ok("preset has been changed".into())
}

#[tauri::command]
async fn updateLivePreset(param: Uma_live) -> Result<String, mongo::MongoError> {
    getMongoClient()
        .await?
        .database("local")
        .collection::<Uma_live>("uma_live")
        .update_one(
            doc! {"_id": &param._id},
            doc! {"$set": bson::to_document(&param)?},
            None,
        )
        .await?;
    Ok("preset has been changed".into())
}

#[tauri::command]
async fn deleteHomePreset(id: ObjectId) -> Result<String, mongo::MongoError> {
    getMongoClient()
        .await?
        .database("local")
        .collection::<Uma_home>("uma_home")
        .delete_one(doc! {"_id": id}, None)
        .await?;
    Ok("selected preset has been deleted".into())
}

#[tauri::command]
async fn deleteLivePreset(id: ObjectId) -> Result<String, mongo::MongoError> {
    getMongoClient()
        .await?
        .database("local")
        .collection::<Uma_live>("uma_live")
        .delete_one(doc! {"_id": id}, None)
        .await?;
    Ok("selected preset has been deleted".into())
}

#[tauri::command]
async fn changeConfig() -> Result<String, mongo::MongoError> {
    Ok("".into())
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
            getLivePreset,
            saveHomePreset,
            saveLivePreset,
            updateHomePreset,
            updateLivePreset,
            deleteHomePreset,
            deleteLivePreset,
            changeConfig
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
