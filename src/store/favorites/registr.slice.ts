import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookie from "js-cookie"

interface regState {
  iSAuth: boolean
  iSregShow: boolean,
  userData: {
    id: string
    login: string
  } | any
}

const initialState: regState = {
  iSAuth: false,
  iSregShow: false,
  userData: {}
}

const regSlice = createSlice({
  name: 'regSlice', 
  initialState,
  reducers: {
    setIsRegShow: (state, action: PayloadAction<boolean>) => {
        state.iSregShow = action.payload
    },
    setIsAuth: (state, action: PayloadAction<boolean>) => {
        state.iSAuth = action.payload
    },
    verifySlice: (state) => {
        const auth = async (): Promise<void> => {
            const accessToken = Cookie.get("AccessToken");
            if (!accessToken) {
                const refreshToken = Cookie.get("RefreshToken");
                if (!refreshToken) {
                  state.userData = {}
                  state.iSAuth = false
                }
                try {
                    const data = await axios.post(
                        `http://localhost:3452/auth/refresh-token`,
                        {
                            "refresh-token": Cookie.get("refreshToken"),
                        }
                    );

                    state.userData = data.data
                    state.iSAuth = true
                } catch (err) {
                  state.userData = {}
                  state.iSAuth = false
                }
            }
            try {
                const data = await axios.get(
                    `http://localhost:3452/auth/verify`,
                    {
                      headers: {
                        Authorization: `Bearer ${Cookie.get('AccessToken')}`
                      }
                    }
                );
                state.userData = data.data
                state.iSAuth = true
            } catch (err) {
              state.userData = {}
              state.iSAuth = false
            }
        };
        auth();
    }
    
  },
});

export const { actions, reducer } = regSlice