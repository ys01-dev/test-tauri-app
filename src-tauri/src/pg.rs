#![allow(non_camel_case_types)]

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct chara_name_data {
    pub id: i32,
    pub chara_name: String,
    pub chara_voice: String,
    pub birth_year: i32,
    pub birth_month: i32,
    pub birth_day: i32,
    pub sex: i32,
    pub height: i32,
    pub bust: i32,
    pub scale: i32,
    pub skin: i32,
    pub chara_category: i32,
}

#[derive(Serialize, Deserialize)]
pub struct dress_name_data {
    pub id: i32,
    pub dress_name: String,
    pub dress_desc: String,
    pub chara_id: i32,
    pub chara_name: String,
}
// impl fmt::Display for dress_name_data {
//     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
//         writeln!(
//             f,
//             "{}\n{}\n{}\n{}\n{}",
//             self.chara_id, self.dress_name, self.dress_desc, self.chara_id, self.chara_name
//         )
//     }
// }

#[derive(Debug, thiserror::Error)]
pub enum PGError {
    #[error(transparent)]
    PgError(#[from] postgres::error::Error),
    #[error(transparent)]
    SerdeError(#[from] serde_json::error::Error),
}
impl serde::Serialize for PGError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub fn getConnStr() -> String {
    format!(
        "host={} port={} user={} password={}",
        "localhost", "5432", "postgres", "password"
    )
}

pub fn getDressDml(name: &String) -> String {
    match name.len() {
        0 => {
            r"select * from dress_name_data where chara_name is null order by id"
            .into()
        }
        _ => {
            r"select * from dress_name_data where chara_name like $1 order by id"
            .into()
        }
    }
}

pub fn getCharaDml() -> String {
    "select * from chara_name_data where chara_name like $1 order by id".into()
}

// fn getPGConfig() -> deadpool_postgres::Config {
//     let mut config: Config = Config::new();
//     config.user = Some(env::var("DB_HOST").unwrap());
//     config.port = Some(env::var("DB_PORT").unwrap().parse::<u16>().unwrap());
//     config.user = Some(env::var("DB_USER").unwrap());
//     config.password = Some(env::var("DB_PASSWORD").unwrap());
//     config.manager = Some(ManagerConfig {
//         recycling_method: RecyclingMethod::Fast,
//     });
//     config
// }

// pub fn getpool() -> Pool {
//     getPGConfig()
//         .create_pool(Some(Runtime::Tokio1), NoTls)
//         .unwrap()
// }
