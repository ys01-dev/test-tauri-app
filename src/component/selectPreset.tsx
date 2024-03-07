import { useRef, useState } from 'react'
import { deletePreset, updatePreset } from "../common"
import { chara_name_data as Chara } from '../tables/chara_name_data'
import { dress_name_data as Dress } from '../tables/dress_name_data'
import { umamusumeDoc, initUmaHome, umaLive, initUmaLive, umaHome, umaLiveChara } from '../tables/umamusume'
import { SnackBar, sleep } from './snackbar';
import "../css/modal.css"
import { dialog } from '@tauri-apps/api'

export const SelectHomePreset: React.FC<{
    presetData: umaHome[],
    selectedReplCharaData: Chara,
    selectedDressData: Dress,
    setModalVisible: (val: boolean) => void,
    onApplyPresetClick: (data: umaHome) => void,
    onPresetClick: () => void
}> = ({ presetData, selectedReplCharaData, selectedDressData, setModalVisible, onApplyPresetClick, onPresetClick }) => {
    const [selectedPreset, setSelectedPreset] = useState<umaHome>(initUmaHome)
    const [selectedRadio, setSelectedRadio] = useState<{ index: number, _id: string }>({ index: -1, _id: "" })
    const [snackBarMessage, setSnackBarMessage] = useState("")
    const [snackBarVisible, setSnackBarVisible] = useState(false)

    const showSnackBar = (message: string) => {
        setSnackBarMessage(message)
        setSnackBarVisible(true)
        sleep(5000).then(() => setSnackBarVisible(false))
    }

    const onUpdateClick = async () => {
        if (selectedRadio.index < 0) {
            showSnackBar("preset isn't selected")
            return
        } else if (selectedReplCharaData.id === 0 || selectedDressData.id === 0) {
            showSnackBar("character or dress isn't selected")
            return
        }
        let ret

        try {
            ret = await updatePreset(umamusumeDoc.uma_home, {
                _id: selectedPreset._id,
                charaID: selectedReplCharaData.id,
                charaName: selectedReplCharaData.chara_name,
                dressID: selectedDressData.id,
                dressName: selectedDressData.dress_name,
                dressDesc: selectedDressData.dress_desc
            })
            onPresetClick()
        } catch (err) {
            ret = err
        }
        showSnackBar(ret)
    }

    const onDeleteClick = async () => {
        if (selectedRadio.index < 0) {
            showSnackBar("preset isn't selected")
        } else if (await dialog.ask("are you sure to delete?", { title: 'confirmation', type: 'warning'})) {
            let ret

            try {
                ret = await deletePreset(umamusumeDoc.uma_home, selectedRadio._id)
                onPresetClick()
            } catch (err) {
                ret = err
            }
            showSnackBar(ret)
        }
    }

    const onPresetRadioChange = (index: number, data: umaHome) => {
        setSelectedPreset(data)
        setSelectedRadio({ index: index, _id: data._id })
    }

    return (
        <div className="modalContainer">
            <div className="overlay" onClick={() => setModalVisible(false)} />
            <div className="modalContent">
                <p className="presetTitle">select preset</p>
                <button className="closeBtn" onClick={() => setModalVisible(false)}>✕</button>
                <div className="presetContainer">
                    {Array.isArray(presetData) && presetData.length > 0 && (
                        <ul>
                            {presetData.map((preset, index) =>
                                <li key={index}>
                                    <label key={index}>
                                        <input type="radio" name="presetRadio" value={preset._id} onChange={() => onPresetRadioChange(index, preset)} />
                                        {`${preset.charaID}:${preset.charaName === "" ? "n/a" : preset.charaName}
                                        (${preset.dressID}:${preset.dressName === "" ? "n/a" : preset.dressName})`}
                                    </label>
                                </li>
                            )}
                        </ul>
                    )}
                </div>
                <div className="modalBtnContainer">
                    <button onClick={() => onApplyPresetClick(selectedPreset)}>apply</button>
                    <button onClick={onUpdateClick}>update</button>
                    <button className="deleteBtn" onClick={onDeleteClick}>delete</button>
                </div>
            </div>
            <SnackBar message={snackBarMessage} visible={snackBarVisible} setVisible={setSnackBarVisible} />
        </div>
    )
}

export const SelectLivePreset: React.FC<{
    presetData: umaLive[],
    selectedLiveCharaArr: umaLiveChara[],
    setModalVisible: (val: boolean) => void,
    onApplyPresetClick: (data: umaLive) => void,
    onPresetClick: () => void
}> = ({ presetData, selectedLiveCharaArr, setModalVisible, onApplyPresetClick, onPresetClick }) => {
    const [selectedPreset, setSelectedPreset] = useState<umaLive>({ ...initUmaLive })
    const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(-1)
    const [openedPresetIndexObj, setOpenedPresetIndexObj] = useState<{ [prop: string]: number }>({})
    const [snackBarMessage, setSnackBarMessage] = useState("")
    const [snackBarVisible, setSnackBarVisible] = useState(false)
    const refPreset = useRef(null)

    const showSnackBar = (message: string) => {
        setSnackBarMessage(message)
        setSnackBarVisible(true)
        sleep(5000).then(() => setSnackBarVisible(false))
    }

    const onUpdateClick = async () => {
        if (selectedPresetIndex < 0) {
            showSnackBar("preset isn't selected")
            return
        }
        let ret
        
        try {
            ret = await updatePreset(umamusumeDoc.uma_live, {
                _id: selectedPreset._id,
                data: selectedLiveCharaArr
            })
            onPresetClick()
        } catch (err) {
            ret = err
        }
        showSnackBar(ret)
    }

    const onDeleteClick = async () => {
        if (selectedPresetIndex < 0) {
            showSnackBar("preset isn't selected")
        } else if (await dialog.ask("are you sure to delete?", { title: 'confirmation', type: 'warning'})) {
            let ret

            try {
                ret = await deletePreset(umamusumeDoc.uma_live, selectedPreset._id)
                onPresetClick()
            } catch (err) {
                ret = err
            }
            showSnackBar(ret)
        }
    }

    const onPresetRadioClick = (index: number) => {
        let obj = (({ ...p }) => {
            openedPresetIndexObj.hasOwnProperty(index.toString()) ? delete p[index.toString()] : p[index.toString()] = index
            return p
        })({ ...openedPresetIndexObj })

        setSelectedPresetIndex(index)
        setOpenedPresetIndexObj({...obj})
    }

    const onExpandClick = () => {
        const tmp: { [prop: string]: number } = {}
        
        if (presetData.length !== Object.keys(openedPresetIndexObj).length) {
            presetData.forEach((_, index) => tmp[index.toString()] = index)
        }
        setOpenedPresetIndexObj({...tmp})
    }

    return (
        <div className="modalContainerLive">
            <div className="overlay" onClick={() => setModalVisible(false)} />
            <div className="modalContentLive">
                <div className="presetTitle">
                    <span>select preset</span>
                    <button className="expandBtn" onClick={onExpandClick}>expand/close all</button>
                    <button className="closeBtn" onClick={() => setModalVisible(false)}>✕</button>
                </div>
                <div ref={refPreset} className="presetContainerLive">
                    {Array.isArray(presetData) && presetData.length > 0 && (
                        <ul>
                            {presetData.map((preset, index) =>
                                <li key={index}>
                                    {preset.data.length > 0 && (
                                        <label key={index}>
                                            <div className="livePresetContainer" title={preset.data.map(obj => ((({ originalCharaName: _1, replCharaName: _2, dressName: _3 }) => {
                                                return (_1 === "" ? "n/a → " : `${_1} → `) + (_2 === "" ? "n/a" : _2) + (_3 === "" ? "(n/a)" : `(${_3})`)
                                            })(obj))).join("\n")}>
                                                <input type="radio" name="presetRadio" onClick={() => onPresetRadioClick(index)} onChange={() => setSelectedPreset({...preset})} />
                                                {`preset${index}`}
                                                {openedPresetIndexObj.hasOwnProperty(index) && preset.data.map((obj, i) =>
                                                    <div key={i} className="livePresetContent">
                                                        {`${obj.originalCharaName === "" ? "n/a" : obj.originalCharaName}
                                                        → ${obj.replCharaName === "" ? "n/a" : obj.replCharaName}
                                                        (${obj.dressName === "" ? "n/a" : obj.dressName})`}
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    )}
                                </li>
                            )}
                        </ul>
                    )}
                </div>
                <div className="modalBtnContainer">
                    <button onClick={() => onApplyPresetClick(selectedPreset)}>apply</button>
                    <button onClick={onUpdateClick}>update</button>
                    <button className="deleteBtn" onClick={onDeleteClick}>delete</button>
                </div>
            </div>
            <SnackBar message={snackBarMessage} visible={snackBarVisible} setVisible={setSnackBarVisible} />
        </div>
    )
}
