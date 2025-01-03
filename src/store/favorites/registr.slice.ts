// src/store/favorites/registr.slice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookie from "js-cookie";

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

// Thunks
export const verifyUser = createAsyncThunk(
    "auth/verifyUser",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const accessToken = Cookie.get("AccessToken");
            if (!accessToken) {
                const refreshToken = Cookie.get("RefreshToken");
                if (!refreshToken)
                    return rejectWithValue("No tokens available");

                const refreshData = await axios.post(
                    "http://localhost:3452/auth/refresh-token",
                    {
                        "refresh-token": refreshToken,
                    }
                );
                console.log(refreshData, 11112);
                
                Cookie.set("AccessToken", refreshData.data.AccessToken, {
                    expires: 15 / (24 * 60)
                });
                Cookie.set("RefreshToken", refreshData.data.RefreshToken, {
                    expires: 15
                });
            }

            const userData = await axios.get(
                "http://localhost:3452/auth/verify",
                {
                    headers: {
                        Authorization: `Bearer ${Cookie.get("AccessToken")}`,
                    },
                }
            );

            return fulfillWithValue(userData.data);
        } catch (err) {
            const message = (err as Error).message;
            return rejectWithValue(message || "Authentication failed");
        }
    }
);

// Slice
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyUser.fulfilled, (state, action) => {
              
                state.userData = action.payload;
                state.iSAuth = true;
            })
            .addCase(verifyUser.rejected, (state) => {
                state.userData = {};
                state.iSAuth = false;
            });
    },
});

export const { actions, reducer } = regSlice;
