import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface Ifilter {
    nameGame: string;
    gameplay: number;
    immersion: number;
    originality: number;
    story: number;
}

const initialState: Ifilter = {
    nameGame: "",
    gameplay: 1,
    immersion: 1,
    originality: 1,
    story: 1
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        filtersGameSlice: (state, action: PayloadAction<Partial<Ifilter>>) => {
            if (action.payload.nameGame !== undefined) {
                state.nameGame = action.payload.nameGame;
            }
            if (action.payload.gameplay !== undefined) {
                state.gameplay = action.payload.gameplay;
            }
            if (action.payload.immersion !== undefined) {
                state.immersion = action.payload.immersion;
            }
            if (action.payload.originality !== undefined) {
                state.originality = action.payload.originality;
            }
            if (action.payload.story !== undefined) {
                state.story = action.payload.story;
            }
        },
    },
});

export const { actions, reducer } = searchSlice;
