import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { reducer as regField } from "./favorites/registr.slice";

const reducers = combineReducers({
  regField: regField,
});

export const store = configureStore({
  reducer: reducers,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
