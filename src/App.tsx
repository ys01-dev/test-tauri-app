import { useState } from 'react';
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import SearchUma from './component/searchUma'
import SearchUma2 from './component/searchUma2'
import { setWidth } from "./store"
import './css/App.css'
import logo from "./image/logo.png";

function App() {
    const dispatch = useDispatch()
    const initialMargin = 160
    const [isSideBarOpened, setSideBarOpened] = useState<boolean>(true)
    const [contentMargin, setContentMargin] = useState<number>(initialMargin)
    const [selected, setSelected] = useState(0)
    const variants = {
        opened: { x: 0, transition: { duration: 0.1, y: { stiffness: 1000 } } },
        closed: { x: "-100%", transition: { duration: 0.1, y: { stiffness: 1000 } } }
        //closed: { opacity: 0, x: "-100% ", minWidth: isSideBarOpened ? 150 + "px" : 0 }
    }
    dispatch(setWidth(contentMargin))

    const onSideBarVisible = () => {
        setSideBarOpened(!isSideBarOpened)
        setContentMargin(isSideBarOpened ? 0 : initialMargin)
        dispatch(setWidth(contentMargin))
    }

    return (
        <div>
            <button className="btn_sideBarVisible" onClick={onSideBarVisible}>≡</button>
            <div className="sidebarContainer">
                <motion.nav className="sidebar" initial={{ x: 0 }} animate={isSideBarOpened ? "opened" : "closed"} variants={variants}>
                    <img src={logo} alt="" />
                    <ul>
                        <li>
                            <button onClick={() => { setSelected(0) }} style={{ backgroundColor: selected === 0 ? "#c6edff" : "" }}>→HomeChara</button>
                        </li>
                        <li>
                            <button onClick={() => { setSelected(1) }} style={{ backgroundColor: selected === 1 ? "#c6edff" : "" }}>→LiveChara</button>
                        </li>
                    </ul>
                </motion.nav>
                <div style={{ marginLeft: contentMargin }}>
                    {selected === 0 ? <SearchUma /> : <SearchUma2 />}
                </div>
            </div>
        </div>
    );
}

export default App;
