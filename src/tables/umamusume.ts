export enum umamusumeDoc {
    uma_home,
    uma_live
}

export type umaHome = {
    _id: string,
    charaID: number,
    charaName: string,
    dressID: number,
    dressName: string,
    dressDesc: string
}

export const initUmaHome = {
    _id: "",
    charaID: 0,
    charaName: "",
    dressID: 0,
    dressName: "",
    dressDesc: ""
}

export type umaLiveChara = {
    originalCharaID: number,
    originalCharaName: string,
    replCharaID: number,
    replCharaName: string,
    dressID: number,
    dressName: string,
}

export const initUmaLiveChara = {
    originalCharaID: 0,
    originalCharaName: "",
    replCharaID: 0,
    replCharaName: "",
    dressID: 0,
    dressName: "",
}

export type umaLive = {
    _id: string,
    data: umaLiveChara[]
}

export const initUmaLive = {
    _id: "",
    data: [
        { originalCharaID: 0, originalCharaName: "", replCharaID: 0, replCharaName: "", dressID: 0, dressName: "", },
        { originalCharaID: 0, originalCharaName: "", replCharaID: 0, replCharaName: "", dressID: 0, dressName: "", },
        { originalCharaID: 0, originalCharaName: "", replCharaID: 0, replCharaName: "", dressID: 0, dressName: "", },
        { originalCharaID: 0, originalCharaName: "", replCharaID: 0, replCharaName: "", dressID: 0, dressName: "", },
        { originalCharaID: 0, originalCharaName: "", replCharaID: 0, replCharaName: "", dressID: 0, dressName: "", }
    ]
}

