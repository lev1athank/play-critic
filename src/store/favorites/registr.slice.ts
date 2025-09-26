// src/store/favorites/registr.slice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { date } from "zod";


interface UserData {
    _id: string;
    login: string;
    userName: string;
    avatar: string;
    lastAvatarIMG: string | null;
}

interface RegState {
    iSAuth: boolean;
    iSregShow: boolean;
    userData: UserData | null;
}

const initialState: RegState = {
    iSAuth: false,
    iSregShow: false,
    userData: null,
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
            state.iSAuth = true;
        },
        clearUserData: (state) => {
            state.userData = null;
            state.iSAuth = false
        },
        setNewUserData: (state, action: PayloadAction<{ lastAvatarIMG?: string, userName?: string }>) => {
            state.userData = {
                ...state.userData,
                ...action.payload
            } as UserData;
        },
    },
});

export const { actions, reducer } = regSlice;
