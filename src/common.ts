import { tauri } from '@tauri-apps/api'
import { umamusumeDoc } from './tables/umamusume';

export const changeConfig = (target: string, param: {}) => {
    let fn = ""
    switch (target) {
        case "home": fn = ""; break;
        case "live": fn = ""; break;
        default: return;
    }
    return tauri.invoke<any>(fn, param).then(res => JSON.parse(res))
}

export const getCharaData = (name: string): Promise<any> => {
    return tauri.invoke<any>("getCharaData", { name: name }).then(res => JSON.parse(res))
}

export const getDressData = (name: string): Promise<any> => {
    return tauri.invoke<any>("getDressData", { name: name }).then(res => JSON.parse(res))
}

export const getPreset = (target: umamusumeDoc) => {
    let fn = ""
    switch (target) {
        case umamusumeDoc.uma_home: fn = "getHomePreset"; break;
        case umamusumeDoc.uma_live: fn = "getLivePreset"; break;
        default: throw new Error("invalid request recieved")
    }
    return tauri.invoke<any>(fn).then(res => JSON.parse(res))
}

export const savePreset = (target: umamusumeDoc, param: any): Promise<any> => {
    let fn = ""
    switch (target) {
        case umamusumeDoc.uma_home: fn = "saveHomePreset"; break;
        case umamusumeDoc.uma_live: fn = "saveLivePreset"; break;
        default: throw new Error("invalid request recieved")
    }
    return tauri.invoke<any>(fn, { param: param })
}

export const updatePreset = (target: umamusumeDoc, param: {}) => {
    let fn = ""
    switch (target) {
        case umamusumeDoc.uma_home: fn = "updateHomePreset"; break;
        case umamusumeDoc.uma_live: fn = "updateLivePreset"; break;
        default: throw new Error("invalid request recieved")
    }
    return tauri.invoke<any>(fn, { param: param })
}

export const deletePreset = (target: umamusumeDoc, id: string) => {
    let fn = ""
    switch (target) {
        case umamusumeDoc.uma_home: fn = "deleteHomePreset"; break;
        case umamusumeDoc.uma_live: fn = "deleteLivePreset"; break;
        default: throw new Error("invalid request recieved")
    }
    return tauri.invoke<any>(fn, { id: id })
}