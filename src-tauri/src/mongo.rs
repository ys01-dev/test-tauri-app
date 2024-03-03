#![allow(non_camel_case_types)]
#![allow(non_snake_case)]

use serde::{Deserialize, Serialize};
use mongodb::{ bson::oid::ObjectId, options::{ ClientOptions, ServerApi, ServerApiVersion }, Client};

const MONGO_URI: &str = "mongodb://127.0.0.1:27017";

#[derive(Serialize, Deserialize)]
pub struct Uma_home {
    _id: Option<ObjectId>,
    charaID: i32,
    charaName: String,
    dressID: i32,
    dressName: String,
    dressDesc: String
}

#[derive(Serialize, Deserialize)]
pub struct Uma_live_chara {
    originalCharaID: i32,
    originalCharaName: String,
    replCharaID: i32,
    replCharaName: String,
    dressID: i32,
    dressName: String,
}

#[derive(Serialize, Deserialize)]
pub struct Uma_live {
    _id: Option<ObjectId>,
    data: Vec<Uma_live_chara>
}

#[derive(Debug, thiserror::Error)]
pub enum MongoError {
  #[error(transparent)]
  MongoError(#[from] mongodb::error::Error),
  #[error(transparent)]
  SerdeError(#[from] serde_json::error::Error)
}
impl serde::Serialize for MongoError {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

pub async fn getMongoClient() -> Result<Client, mongodb::error::Error> {
    let mut clientOption = ClientOptions::parse(MONGO_URI).await?;
    let api = ServerApi::builder().version(ServerApiVersion::V1).build();
    clientOption.server_api = Some(api);
    Ok(Client::with_options(clientOption)?)
}
