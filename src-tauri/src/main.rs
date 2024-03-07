// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(non_snake_case)]

mod config_type;
mod mongo;
mod pg;
mod _string;

use crate::config_type::ReplaceGlobalChar;
use bson::oid::ObjectId;
use config_type::{Config_json, Param_ReplaceHomeStandChar, ReplaceGlobalChar_data};
use futures::TryStreamExt;
use mongo::{getMongoClient, Param_Uma_home, Param_Uma_live, Uma_home, Uma_live};
use mongodb::bson::doc;
use pg::{chara_name_data, dress_name_data, getCharaDml, getConnStr, getDressDml};
use postgres::{Client, NoTls};
use std::io::BufWriter;
use std::{fs::File, io::BufReader};

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
async fn saveHomePreset(param: Param_Uma_home) -> Result<String, mongo::MongoError> {
    getMongoClient()
        .await?
        .database("local")
        .collection::<Param_Uma_home>("uma_home")
        .insert_one(param, None)
        .await?;
    Ok("successfully saved a preset".into())
}

#[tauri::command]
async fn saveLivePreset(param: Param_Uma_live) -> Result<String, mongo::MongoError> {
    getMongoClient()
        .await?
        .database("local")
        .collection::<Param_Uma_live>("uma_live")
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

#[warn(unused_variables)]
#[tauri::command]
fn changeConfigHome(param: Param_ReplaceHomeStandChar) -> Result<String, config_type::ConfigError> {
    let file = File::open(_string::CONFIG_PATH)?;
    let mut configJson = serde_json::from_reader::<BufReader<File>, Config_json>(BufReader::new(file))?;

    configJson.replaceHomeStandChar.enable = param.enable;
    if param.enable {
        if param.isOrgChange {
            if match param.data.get(0) {
                    Some(_) => 1,
                    None => -1
                } < 0 || match configJson.replaceHomeStandChar.data.get(0) {
                        Some(_) => 1,
                        None => -1
                } < 0
            {
                return Err(config_type::ConfigError::JsonParseError);
            };
            configJson.replaceHomeStandChar.data.get_mut(0).unwrap().origCharId = param.data.get(0).unwrap().origCharId;
        };
        configJson.replaceHomeStandChar.data.get_mut(0).unwrap().newChrId = param.data.get(0).unwrap().newChrId;
        configJson.replaceHomeStandChar.data.get_mut(0).unwrap().newClothId = param.data.get(0).unwrap().newClothId;
    }

    let targetFile = File::create(_string::CONFIG_PATH)?;
    serde_json::to_writer(BufWriter::new(targetFile), &configJson)?;
    Ok("successfully home settings have been changed".into())
}

#[tauri::command]
fn changeConfigLive(param: ReplaceGlobalChar) -> Result<String, config_type::ConfigError> {
    let file = File::open(_string::CONFIG_PATH)?;
    let mut configJson = serde_json::from_reader::<BufReader<File>, Config_json>(BufReader::new(file))?;

    configJson.replaceGlobalChar.enable = param.enable;
    if param.enable {
        let mut data = Vec::<ReplaceGlobalChar_data>::new();
        for item in param.data {
            if item.newChrId != 0 && item.newClothId != 0 && item.origCharId != 0 {
                data.push(item);
            };
        };
        configJson.replaceGlobalChar.data = data;
    }

    let targetFile = File::create(_string::CONFIG_PATH)?;
    serde_json::to_writer(BufWriter::new(targetFile), &configJson)?;
    Ok("successfully live settings have been changed".into())
}

fn main() {
    tauri::Builder::default()
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
            changeConfigHome,
            changeConfigLive
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
