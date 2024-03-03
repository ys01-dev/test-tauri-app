import React from 'react'
import { chara_name_data as Chara } from '../tables/chara_name_data'
import "../css/resultArea.css"

const GetUmaHome: React.FC<{setSelectedCharaData: (val: Chara) => void, charaData: Chara[], radioName: string}> = ({setSelectedCharaData, charaData, radioName}) => {
    return (
        <div className="umaHome">
            {Array.isArray(charaData) && charaData.length > 0 && (
                <ul>
                    {charaData.map((chara, index) =>
                        <li key={index}>
                            <label key={index}>
                                <input type="radio" name={radioName} value={chara.id.toString()}
                                    onClick={() => setSelectedCharaData({...chara})} />
                                {`${chara.id} ${chara.chara_name ?? "不明"} (${chara.chara_voice})`}
                            </label>
                        </li>
                    )}
                </ul>
            )}
            {Array.isArray(charaData) && charaData.length === 0 && (
                <p>0 items</p>
            )}
        </div>
    )
}

export default GetUmaHome