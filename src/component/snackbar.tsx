import React from "react";
import "../css/snackbar.css"

export const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));

export const SnackBar: React.FC<{message: string, visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>>}> = ({message, visible, setVisible}) => {
    return(
        <div className="snackbar" style={{display: visible ? "block" : "none"}} onClick={() => setVisible(false)}>
            {message}
        </div>
    )
}
