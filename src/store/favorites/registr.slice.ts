import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface regState {
  iSAuth: boolean
  iSregShow: boolean
}

const initialState: regState = {
  iSAuth: false,
  iSregShow: false
};

const regSlice = createSlice({
  name: 'regSlice', 
  initialState,
  reducers: {
    setIsRegShow: (state, action: PayloadAction<boolean>) => {
        state.iSregShow = action.payload
    },
    setIsAuth: (state, action: PayloadAction<boolean>) => {
        state.iSAuth = action.payload
    }
  },
});

export const { actions, reducer } = regSlice