import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { reducer as regField } from "./favorites/registr.slice";
import { reducer as newGame } from "./favorites/currentGame";
import { reducer as search } from "./favorites/search.slice";

const reducers = combineReducers({
  regField: regField,
  newGame: newGame,
  search: search


});

export const store = configureStore({
  reducer: reducers
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
