import { tauri } from '@tauri-apps/api'
import axios from 'axios'

export const targetUrl = "http://192.168.11.2:4000/"

export const getCharaData = (name: string): Promise<any> => {
    return tauri.invoke<any>("getCharaData", {name: name}).then(res => JSON.parse(res))
}

export const getDressData = (name: string): Promise<any> => {
    return tauri.invoke<any>("getDressData", {name: name}).then(res => JSON.parse(res))
}

export const changeConfig = (url: string, param: {}) => {
    return new Promise<any>((resolve, rejects) => {
        axios.post(targetUrl + url, param
        ).then(res => resolve(res.data.message)
        ).catch(err => rejects(err.response === undefined ? err.message : err.response.data.message))
    })
}

export const getPreset = (target: string) => {
    let fn = ""
    switch (target) {
        case "home": fn = "getHomePreset"; break;
        case "live": fn = "getLivePreset"; break;
        default: return;
    }
    return tauri.invoke<any>(fn).then(res => JSON.parse(res))
}

export const savePreset = (url: string, param: {}) => {
    return new Promise<any>((resolve, rejects) => {
        axios.post(targetUrl + url, param).then(res => {
            resolve(res.data.message)
        }).catch(err => {
            rejects(err.response === undefined ? err.message : err.response.data.message)
        })
    })
}

export const updatePreset = (url: string, param: {}) => {
    return new Promise<any>((resolve, rejects) => {
        axios.patch(targetUrl + url, param).then(res => {
            resolve(res.data.message)
        }).catch(err => {
            rejects(err.response === undefined ? err.message : err.response.data.message)
        })
    })
}

export const deletePreset = (param: {}) => {
    return new Promise<any>((resolve, rejects) => {
        axios.delete(targetUrl + "deletePreset", { data: param }).then(res => {
            resolve(res.data.message)
        }).catch(err => {
            rejects(err.response === undefined ? err.message : err.response.data.message)
        })
    })
}