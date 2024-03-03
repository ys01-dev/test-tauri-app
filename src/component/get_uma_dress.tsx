import React from 'react'
import { dress_name_data as Dress } from '../tables/dress_name_data'
import "../css/resultArea.css"

const GetUmaDress: React.FC<{setSelectedDressData: (val: Dress) => void, dressData: Dress[], radioName: string}> = ({setSelectedDressData, dressData, radioName}) => {
    return (
        <div className="dress">
            {Array.isArray(dressData) && dressData.length > 0 && (
                <ul>
                    {dressData.map((dress, index) =>
                        <li key={index}>
                            <label key={index}>
                                <input type="radio" name={radioName} value={dress.id.toString()}
                                    onClick={() => setSelectedDressData({...dress})} />
                                {`${dress.id} ${dress.dress_name} 　(${dress.dress_desc})`}
                            </label>
                        </li>
                    )}
                </ul>
            )}
            {Array.isArray(dressData) && dressData.length === 0 && (
                <p>0 items</p>
            )}
        </div>
    )
}

export default GetUmaDress