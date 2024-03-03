import React from 'react'
import { deletePreset, updatePreset } from "../common"
import { chara_name_data as Chara } from '../tables/chara_name_data'
import { dress_name_data as Dress } from '../tables/dress_name_data'
import { umamusumeDoc, initUmaHome, umaLive, initUmaLive, umaHome, umaLiveChara } from '../tables/umamusume'
import { SnackBar, sleep } from './snackbar';
import "../css/modal.css"

export const SelectHomePreset: React.FC<{
    presetData: umaHome[],
    selectedReplCharaData: Chara,
    selectedDressData: Dress,
    setModalVisible: (val: boolean) => void,
    onApplyPresetClick: (data: umaHome) => void,
    onPresetClick: () => void
}> = ({ presetData, selectedReplCharaData, selectedDressData, setModalVisible, onApplyPresetClick, onPresetClick }) => {
    const [selectedPreset, setSelectedPreset] = React.useState<umaHome>(initUmaHome)
    const [selectedRadio, setSelectedRadio] = React.useState<{ index: number, _id: string }>({ index: -1, _id: "" })
    const [snackBarMessage, setSnackBarMessage] = React.useState("")
    const [snackBarVisible, setSnackBarVisible] = React.useState(false)

    const showSnackBar = (message: string) => {
        setSnackBarMessage(message)
        setSnackBarVisible(true)
        sleep(5000).then(() => setSnackBarVisible(false))
    }

    const onUpdateClick = async () => {
        if (selectedRadio.index < 0) {
            showSnackBar("preset isn't selected")
            return
        } else if(selectedReplCharaData.id === 0 || selectedDressData.id === 0) {
            showSnackBar("character or dress isn't selected")
            return
        }
        let ret

        try {
            ret = await updatePreset("updateHomePreset", {
                col: umamusumeDoc.uma_home,
                _id: selectedRadio._id,
                charaID: selectedReplCharaData.id,
                charaName: selectedReplCharaData.chara_name,
                dressID: selectedDressData.id,
                dressName: selectedDressData.dress_name,
                dressDesc: selectedDressData.dress_desc
            })
            onPresetClick()
        } catch(err) {
            ret =err
        }
        showSnackBar(ret)
    }

    const onDeleteClick = async () => {
        if (selectedRadio.index < 0) {
            showSnackBar("preset isn't selected")
        } else if (window.confirm("are you sure to delete?")) {
            let ret
            
            try {
                ret = await deletePreset({ col: umamusumeDoc.uma_home, _id: selectedRadio._id })
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
                            {presetData.map((data, index) =>
                                <li key={index}>
                                    <label key={index}>
                                        <input type="radio" name="presetRadio" value={data._id} onChange={() => onPresetRadioChange(index, data)} />
                                        {`${data.charaID}:${data.charaName === "" ? "n/a" : data.charaName}
                                        (${data.dressID}:${data.dressName === "" ? "n/a" : data.dressName})`}
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
    const [selectedPreset, setSelectedPreset] = React.useState<umaLive>({...initUmaLive})
    const [selectedPresetIndex, setSelectedPresetIndex] = React.useState<number>(-1)
    const [selectedPresetIndexObj, setSelectedPresetIndexObj] = React.useState<{[prop: string]: number}>({})
    const [snackBarMessage, setSnackBarMessage] = React.useState("")
    const [snackBarVisible, setSnackBarVisible] = React.useState(false)

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
            ret = await updatePreset("updateLivePreset", {
                col: umamusumeDoc.uma_live,
                _id: selectedPreset._id,
                data: selectedLiveCharaArr
            })
            onPresetClick()
        } catch(err) {
            ret =err
        }
        showSnackBar(ret)
    }

    const onDeleteClick = async () => {
        if (selectedPresetIndex < 0) {
            showSnackBar("preset isn't selected")
        } else if (window.confirm("are you sure to delete?")) {
            let ret

            try {
                ret = await deletePreset({ col: umamusumeDoc.uma_live, _id: selectedPreset._id })
                onPresetClick()
            } catch (err) {
                ret = err
            }
            showSnackBar(ret)
        }
    }

    const onPresetRadioClick = (index: number) => {
        let obj = (({...p}) => {
            selectedPresetIndexObj.hasOwnProperty(index.toString()) ? delete p[index.toString()] : p[index.toString()] = index
            return p
        })({...selectedPresetIndexObj})

        setSelectedPresetIndex(index)
        setSelectedPresetIndexObj(obj)
    }

    const onExpandClick = () => {
        const tmp: {[prop: string]: number} = {}
        setSelectedPresetIndexObj({})
        
        if(selectedPreset.data.length !== Object.keys(selectedPresetIndexObj).length) {
            selectedPreset.data.forEach((_, index) => tmp[index.toString()] = index)
            setSelectedPresetIndexObj(tmp)
        }
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
                <div className="presetContainerLive">
                    {Array.isArray(presetData) && presetData.length > 0 && (
                        <ul>
                            {presetData.map((preset, index) =>
                                <li key={index}>
                                    {preset.data.length > 0 && (
                                        <label key={index}>
                                            <div className="livePresetContainer" title={preset.data.map(obj => ((({ originalCharaName: _1, replCharaName: _2, dressName: _3 }) => {
                                                return (_1 === "" ? "n/a → " : `${_1} → `) + (_2 === "" ? "n/a" : _2) + (_3 === "" ? "(n/a)" : `(${_3})`)
                                            })(obj))).join("\n")}>
                                                <input type="radio" name="presetRadio" onClick={() => onPresetRadioClick(index)} onChange={() => setSelectedPreset(preset)} />
                                                {`preset${index}`}
                                                {selectedPresetIndexObj.hasOwnProperty(index) && preset.data.map((obj, i) =>
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
