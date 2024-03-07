import { tauri } from '@tauri-apps/api'
import { umamusumeDoc } from './tables/umamusume';

export const changeConfig = async (target: umamusumeDoc, param: {}) => {
    let fn = ""
    switch (target) {
        case umamusumeDoc.uma_home: fn = "changeConfigHome"; break;
        case umamusumeDoc.uma_live: fn = "changeConfigLive"; break;
        default: throw new Error("recieved invalid request")
    }
    return await tauri.invoke<any>(fn, { param: param })
}

export const getCharaData = async (name: string) => {
    return await tauri.invoke<any>("getCharaData", { name: name }).then(res => JSON.parse(res))
}

export const getDressData = async (name: string) => {
    return await tauri.invoke<any>("getDressData", { name: name }).then(res => JSON.parse(res))
}

export const getPreset = async (target: umamusumeDoc) => {
    let fn = ""
    switch (target) {
        case umamusumeDoc.uma_home: fn = "getHomePreset"; break;
        case umamusumeDoc.uma_live: fn = "getLivePreset"; break;
        default: throw new Error("recieved invalid request")
    }
    return await tauri.invoke<any>(fn).then(res => JSON.parse(res))
}

export const savePreset = async (target: umamusumeDoc, param: any) => {
    let fn = ""
    switch (target) {
        case umamusumeDoc.uma_home: fn = "saveHomePreset"; break;
        case umamusumeDoc.uma_live: fn = "saveLivePreset"; break;
        default: throw new Error("recieved invalid request")
    }
    return await tauri.invoke<any>(fn, { param: param })
}

export const updatePreset = async (target: umamusumeDoc, param: {}) => {
    let fn = ""
    switch (target) {
        case umamusumeDoc.uma_home: fn = "updateHomePreset"; break;
        case umamusumeDoc.uma_live: fn = "updateLivePreset"; break;
        default: throw new Error("recieved invalid request")
    }
    return await tauri.invoke<any>(fn, { param: param })
}

export const deletePreset = async (target: umamusumeDoc, id: string) => {
    let fn = ""
    switch (target) {
        case umamusumeDoc.uma_home: fn = "deleteHomePreset"; break;
        case umamusumeDoc.uma_live: fn = "deleteLivePreset"; break;
        default: throw new Error("recieved invalid request")
    }
    return await tauri.invoke<any>(fn, { id: id })
}