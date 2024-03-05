#![allow(non_camel_case_types)]
#![allow(non_snake_case)]

use mongodb::{
    bson::oid::ObjectId,
    options::{ClientOptions, ServerApi, ServerApiVersion},
    Client,
};
use serde::{Deserialize, Serialize};

const MONGO_URI: &str = "mongodb://127.0.0.1:27017";

#[readonly::make]
#[derive(Serialize, Deserialize)]
pub struct Uma_home {
    pub _id: Option<ObjectId>,
    pub charaID: i32,
    pub charaName: String,
    pub dressID: i32,
    pub dressName: String,
    pub dressDesc: String
}

#[readonly::make]
#[derive(Serialize, Deserialize)]
pub struct param_Uma_home {
    pub charaID: i32,
    pub charaName: String,
    pub dressID: i32,
    pub dressName: String,
    pub dressDesc: String
}

#[readonly::make]
#[derive(Serialize, Deserialize)]
pub struct Uma_live_chara {
    pub originalCharaID: i32,
    pub originalCharaName: String,
    pub replCharaID: i32,
    pub replCharaName: String,
    pub dressID: i32,
    pub dressName: String
}

#[readonly::make]
#[derive(Serialize, Deserialize)]
pub struct Uma_live {
    pub _id: Option<ObjectId>,
    pub data: Vec<Uma_live_chara>
}

#[readonly::make]
#[derive(Serialize, Deserialize)]
pub struct param_Uma_live {
    pub data: Vec<Uma_live_chara>
}

#[derive(Debug, thiserror::Error)]
pub enum MongoError {
    #[error(transparent)]
    MongoError(#[from] mongodb::error::Error),
    #[error(transparent)]
    SerdeError(#[from] serde_json::error::Error),
    #[error(transparent)]
    BsonError(#[from] bson::ser::Error),
    #[error(transparent)]
    OIDError(#[from] bson::oid::Error)
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
