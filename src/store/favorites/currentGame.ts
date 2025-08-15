// src/store/favorites/registr.slice.ts
import { ICard } from "@/types/Card";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { boolean } from "zod";


interface currentGame {
    isEditOrAdd: boolean
    isPreview: boolean
    game: ICard | null,
    isUser: boolean
    gamesLibrary: ICard[] | null
}


const initialState: currentGame = {
    isEditOrAdd: false,
    isPreview: false,
    game: null,
    isUser: false,
    gamesLibrary: null
};

const newGameSlice = createSlice({
    name: "newGame",
    initialState,
    reducers: {
        toggleEditOrAdd: (state, action: PayloadAction<boolean>) => {
            state.isEditOrAdd = action.payload;
            state.isPreview = false
        },
        toggleIsPreview: (state, action: PayloadAction<boolean>) => {
            state.isPreview = action.payload;
            state.isEditOrAdd = false;
        },
        setGame: (state, action: PayloadAction<{ game: currentGame["game"], isUser: boolean }>) => {
            state.game = action.payload.game;
            state.isUser = action.payload.isUser;
        },
        updateLibrary: (state, action: PayloadAction<ICard[]>) => {
            if (!action.payload) return;
            // Обновляем или добавляем игру в библиотеку
            if (!state.gamesLibrary) {
                state.gamesLibrary = action.payload;
            } else {
                const existingGamesMap = new Map(state.gamesLibrary.map(game => [game.appid, game]));
                const newGames: ICard[] = [];
                // Обновляем существующие игры и собираем новые
                for (const game of action.payload) {
                    if (existingGamesMap.has(game.appid)) {
                        existingGamesMap.set(game.appid, game); // обновляем
                    } else {
                        newGames.push(game); // новые игры
                    }
                }
                // Сохраняем порядок старых, обновляя изменённые
                const updatedLibrary = state.gamesLibrary.map(game =>
                    existingGamesMap.get(game.appid)!
                );
                
                state.gamesLibrary = [...newGames, ...updatedLibrary];
            }
        },

        // Удаляет игру из библиотеки по appid
        removeFromLibrary: (state, action: PayloadAction<number>) => {
            if (!state.gamesLibrary) return;
            state.gamesLibrary = state.gamesLibrary.filter(game => game.appid !== action.payload);
        },

        clearLibrary: (state) => {
            state.gamesLibrary = null
        },

        clearGame: (state, action: PayloadAction<boolean>) => {
            state.game = null;
            state.isUser = false
            state.isEditOrAdd = !action ? true : false
            state.isPreview = false
        },

    },
});

export const { actions, reducer } = newGameSlice;
