// src/store/favorites/registr.slice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";


interface UserData {
    id: string;
    login: string;
}

interface RegState {
    iSAuth: boolean;
    iSregShow: boolean;
    userData: UserData | any;
}

const initialState: RegState = {
    iSAuth: false,
    iSregShow: false,
    userData: {},
};

const regSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsRegShow: (state, action: PayloadAction<boolean>) => {
            state.iSregShow = action.payload;
        },
        setIsAuth: (state, action: PayloadAction<boolean>) => {
            state.iSAuth = action.payload;
        },
        setUserData: (state, action: PayloadAction<UserData>) => {
            state.userData = action.payload;
            state.iSAuth = true
        },
        clearUserData: (state) => {
            state.userData = {};
            state.iSAuth = false
        },
    },
});

export const { actions, reducer } = regSlice;
