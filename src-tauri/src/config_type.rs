#![allow(non_camel_case_types)]
#![allow(non_snake_case)]

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Aspect_ratio_new {
    w: i32,
    h: i32,
    forceLandscape: bool
}

#[derive(Serialize, Deserialize)]
struct Live {
    free_camera: bool,
    mouseSpeed: i32,
    force_changeVisibility_false: bool,
    moveStep: f64,
    enableLiveDofController: bool,
    close_all_blur: bool,
    setLiveFovAsGlobal: bool
}

#[derive(Serialize, Deserialize)]
struct HomeSettings {
    free_camera: bool
}

#[derive(Serialize, Deserialize)]
struct Follow_offset {
    distance: i32,
    x: i32,
    y: i32,
    z: i32
}

#[derive(Serialize, Deserialize)]
struct Race_camera {
    free_camera: bool,
    moveStep: i32,
    defaultFOV: i32,
    freecam_lookat_target: bool,
    freecam_follow_target: bool,
    follow_offset: Follow_offset
}

#[derive(Serialize, Deserialize)]
struct ExternalPlugin {
    hotkey: String,
    path: String,
    openExternalPluginOnLoad: bool
}

#[derive(Serialize, Deserialize)]
struct AutoUpdate {
    source: String,
    path: String
}

#[derive(Serialize, Deserialize)]
struct ReplaceHomeStandChar_data {
    origCharId: i32,
    newChrId: i32,
    newClothId: i32
}

#[derive(Serialize, Deserialize)]
struct ReplaceHomeStandChar {
    enable: bool,
    data: Vec<ReplaceHomeStandChar_data>
}

#[derive(Serialize, Deserialize)]
struct ReplaceGlobalChar_data {
    origCharId: i32,
    newChrId: i32,
    newClothId: i32,
    replaceMini: bool
}

#[derive(Serialize, Deserialize)]
struct ReplaceGlobalChar {
    enable: bool,
    replaceUniversal: bool,
    data: Vec<ReplaceGlobalChar_data>
}

#[derive(Serialize, Deserialize)]
struct RaceInfoTab {
    enableRaceInfoTab: bool,
    raceInfoTabAttachToGame: bool
}

#[derive(Serialize, Deserialize)]
struct CustomPath {
    enableCustomPersistentDataPath: bool,
    customPersistentDataPath: String
}

#[derive(Serialize, Deserialize)]
pub struct config_json {
    enableConsole: bool,
    enableLogger: bool,
    dumpStaticEntries: bool,
    maxFps: i32,
    better60FPS: bool,
    highQuality: bool,
    virtual_resolution_multiple: i32,
    enableVSync: bool,
    unlockSize: bool,
    uiScale: i32,
    aspect_ratio_new: Aspect_ratio_new,
    autoFullscreen: bool,
    fullscreenBlockMinimization: bool,
    readRequestPack: bool,
    extraAssetBundlePaths: Vec<String>,
    replaceFont: bool,
    customFontPath: String,
    customFontSizeOffset: i32,
    customFontStyle: i32,
    customFontLinespacing: f64,
    replaceAssets: bool,
    assetLoadLog: bool,
    live: Live,
    homeSettings: HomeSettings,
    race_camera: Race_camera,
    cutin_first_person: bool,
    externalPlugin: ExternalPlugin,
    autoChangeLineBreakMode: bool,
    resolution_start: Vec<i32>,
    httpServerPort: i32,
    dicts: Vec<String>,
    static_dict: String,
    no_static_dict_cache: bool,
    stories_path: String,
    text_data_dict: String,
    character_system_text_dict: String,
    race_jikkyo_comment_dict: String,
    race_jikkyo_message_dict: String,
    autoUpdate: AutoUpdate,
    enableBuiltinAutoUpdate: bool,
    replaceHomeStandChar: ReplaceHomeStandChar,
    replaceGlobalChar: ReplaceGlobalChar,
    loadDll: Vec<String>,
    raceInfoTab: RaceInfoTab,
    customPath: CustomPath,
    uploadGachaHistory: bool,
    cutin_first_persion: bool
}