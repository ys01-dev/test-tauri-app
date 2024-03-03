import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import { Provider } from "react-redux";
import { sideBarStore } from "./store"

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Provider store={sideBarStore}>
            <App />
        </Provider>
    </React.StrictMode>
);