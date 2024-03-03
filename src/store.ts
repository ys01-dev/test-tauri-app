import { configureStore, createSlice } from "@reduxjs/toolkit";

const sideBarSlice = createSlice({
    name: "sideBar",
    initialState: {
        width: 160
    },
    reducers: {
        setWidth: (state, action) => {
            state.width = action.payload
        }
    }
})

export const { setWidth } = sideBarSlice.actions

export const sideBarStore = configureStore({
    reducer: {
        sideBar: sideBarSlice.reducer
    }
})
